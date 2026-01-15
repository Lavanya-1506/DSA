import Submission from '../models/Submission.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';

// Submit solution
export const submitSolution = async (req, res) => {
  try {
    const { challengeId, code, language } = req.body;
    const userId = req.user.id;

    if (!challengeId || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide challengeId and code',
      });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }

    // Create submission
    const submission = new Submission({
      userId,
      challengeId,
      code,
      language,
      totalTests: challenge.testCases.length,
    });

    // Basic test execution simulation
    let testsPassed = 0;
    const testResults = [];

    for (let i = 0; i < challenge.testCases.length; i++) {
      const testCase = challenge.testCases[i];
      const passed = code.includes('return') || code.includes('console.log');

      testResults.push({
        testCase: i + 1,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: passed ? testCase.output : 'Error',
        passed,
      });

      if (passed) testsPassed++;
    }

    submission.testsPassed = testsPassed;
    submission.testResults = testResults;
    submission.status = testsPassed === challenge.testCases.length ? 'Accepted' : 'Wrong Answer';
    submission.executionTime = Math.random() * 1000;
    submission.memory = Math.random() * 50;

    await submission.save();

    // Update challenge stats
    challenge.stats.totalAttempts += 1;
    if (submission.status === 'Accepted') {
      challenge.stats.totalSolutions += 1;
    }
    challenge.stats.acceptanceRate = (challenge.stats.totalSolutions / challenge.stats.totalAttempts) * 100;
    await challenge.save();

    // Update user stats
    const user = await User.findById(userId);
    user.stats.totalProblemsAttempted += 1;
    if (submission.status === 'Accepted') {
      user.stats.totalProblemsSolved += 1;
      await user.updateStreak();
    }
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Solution submitted successfully',
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all submissions for a challenge
export const getChallengeSubmissions = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const submissions = await Submission.find({ challengeId })
      .populate('userId', 'firstName lastName')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await Submission.find({ userId })
      .populate('challengeId', 'title difficulty category')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single submission
export const getSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id)
      .populate('userId', 'firstName lastName')
      .populate('challengeId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { difficulty, category, limit = 20 } = req.query;

    let matchStage = {};
    if (difficulty) {
      matchStage.difficulty = difficulty;
    }
    if (category) {
      matchStage.category = category;
    }

    // Aggregate user stats
    const leaderboard = await Submission.aggregate([
      {
        $match: { status: 'Accepted' },
      },
      {
        $group: {
          _id: '$userId',
          totalSolved: { $sum: 1 },
          lastSubmission: { $max: '$submittedAt' },
        },
      },
      {
        $sort: { totalSolved: -1, lastSubmission: -1 },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: 1,
          totalSolved: 1,
          lastSubmission: 1,
          'userInfo.firstName': 1,
          'userInfo.lastName': 1,
          'userInfo.country': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get detailed leaderboard with ranking
export const getDetailedLeaderboard = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const leaderboard = await Submission.aggregate([
      {
        $match: { status: 'Accepted' },
      },
      {
        $group: {
          _id: '$userId',
          totalSolved: { $sum: 1 },
          lastSubmission: { $max: '$submittedAt' },
          acceptedSubmissions: { $push: '$_id' },
        },
      },
      {
        $sort: { totalSolved: -1, lastSubmission: -1 },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          rank: { $add: [1] },
        },
      },
      {
        $project: {
          rank: 1,
          _id: '$user._id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          country: '$user.country',
          totalSolved: 1,
          lastSubmission: 1,
          profileImage: '$user.profileImage',
        },
      },
    ]);

    // Add rankings
    leaderboard.forEach((user, index) => {
      user.rank = index + 1;
    });

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user ranking
export const getUserRanking = async (req, res) => {
  try {
    const userId = req.user.id;

    const userRank = await Submission.aggregate([
      {
        $match: { status: 'Accepted' },
      },
      {
        $group: {
          _id: '$userId',
          totalSolved: { $sum: 1 },
        },
      },
      {
        $sort: { totalSolved: -1 },
      },
      {
        $addFields: {
          rank: { $add: [1] },
        },
      },
      {
        $match: { _id: userId },
      },
    ]);

    if (userRank.length === 0) {
      return res.status(200).json({
        success: true,
        ranking: null,
        message: 'User has no accepted solutions',
      });
    }

    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      ranking: {
        rank: userRank[0].rank,
        totalSolved: userRank[0].totalSolved,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          country: user.country,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
