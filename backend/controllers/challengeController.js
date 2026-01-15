import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';

// Get all challenges
export const getAllChallenges = async (req, res) => {
  try {
    const { difficulty, category, search } = req.query;
    let query = { isPublished: true };

    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const challenges = await Challenge.find(query)
      .select('-solutionCode -testCases')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Calculate stats from submissions for each challenge
    const challengesWithStats = await Promise.all(
      challenges.map(async (challenge) => {
        const submissions = await Submission.find({ challengeId: challenge._id });
        
        const totalAttempts = submissions.length;
        const totalSolutions = submissions.filter(s => s.status === 'Accepted').length;
        const acceptanceRate = totalAttempts > 0 ? ((totalSolutions / totalAttempts) * 100) : 0;
        const avgTime = submissions.length > 0 
          ? Math.round(submissions.reduce((sum, s) => sum + (s.executionTime || 0), 0) / submissions.length)
          : 0;

        return {
          ...challenge.toObject(),
          stats: {
            totalAttempts,
            totalSolutions,
            acceptanceRate: parseFloat(acceptanceRate.toFixed(2)),
            averageTime: avgTime
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: challengesWithStats.length,
      challenges: challengesWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single challenge
export const getChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findById(id).populate('createdBy', 'firstName lastName');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }

    // Calculate stats from submissions
    const submissions = await Submission.find({ challengeId: id });
    
    const totalAttempts = submissions.length;
    const totalSolutions = submissions.filter(s => s.status === 'Accepted').length;
    const acceptanceRate = totalAttempts > 0 ? ((totalSolutions / totalAttempts) * 100) : 0;
    const avgTime = submissions.length > 0 
      ? Math.round(submissions.reduce((sum, s) => sum + (s.executionTime || 0), 0) / submissions.length)
      : 0;

    const challengeWithStats = {
      ...challenge.toObject(),
      stats: {
        totalAttempts,
        totalSolutions,
        acceptanceRate: parseFloat(acceptanceRate.toFixed(2)),
        averageTime: avgTime
      }
    };

    res.status(200).json({
      success: true,
      challenge: challengeWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create challenge (Admin only)
export const createChallenge = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      problemStatement,
      exampleInput,
      exampleOutput,
      constraints,
      hints,
      solutionCode,
      timeComplexity,
      spaceComplexity,
      testCases,
      tags,
    } = req.body;

    // Validation
    if (!title || !description || !problemStatement || !solutionCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const challenge = new Challenge({
      title,
      description,
      difficulty,
      category,
      problemStatement,
      exampleInput,
      exampleOutput,
      constraints,
      hints,
      solutionCode,
      timeComplexity,
      spaceComplexity,
      testCases,
      tags,
      createdBy: req.user.id,
    });

    await challenge.save();

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update challenge (Admin only)
export const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const challenge = await Challenge.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Challenge updated successfully',
      challenge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete challenge (Admin only)
export const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findByIdAndDelete(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }

    // Delete all submissions for this challenge
    await Submission.deleteMany({ challengeId: id });

    res.status(200).json({
      success: true,
      message: 'Challenge deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get challenges by difficulty
export const getChallengesByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid difficulty level',
      });
    }

    const challenges = await Challenge.find({ difficulty, isPublished: true })
      .select('-solutionCode -testCases')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: challenges.length,
      challenges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get challenges by category
export const getChallengesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const challenges = await Challenge.find({ category, isPublished: true })
      .select('-solutionCode -testCases')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: challenges.length,
      challenges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's challenge progress
export const getUserChallengeProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const submissions = await Submission.find({ userId }).populate('challengeId');
    const solvedChallenges = await Submission.find({
      userId,
      status: 'Accepted',
    }).distinct('challengeId');

    const stats = {
      totalAttempted: new Set(submissions.map((s) => s.challengeId._id.toString())).size,
      totalSolved: solvedChallenges.length,
      attemptsByDifficulty: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
      },
      solvedByDifficulty: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
      },
    };

    const challengeMap = new Map();
    for (const submission of submissions) {
      const challengeId = submission.challengeId._id.toString();
      if (!challengeMap.has(challengeId)) {
        challengeMap.set(challengeId, submission.challengeId);
        stats.attemptsByDifficulty[submission.challengeId.difficulty]++;
      }
    }

    for (const challengeId of solvedChallenges) {
      const challenge = await Challenge.findById(challengeId);
      stats.solvedByDifficulty[challenge.difficulty]++;
    }

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
