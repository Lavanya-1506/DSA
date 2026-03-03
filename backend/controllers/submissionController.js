import Submission from '../models/Submission.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import vm from 'vm';

const PISTON_API_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_ALIASES = {
  javascript: 'javascript',
  js: 'javascript',
  python: 'python3',
  py: 'python3',
  java: 'java',
  c: 'c',
  cpp: 'c++',
  'c++': 'c++',
};

const LANGUAGE_LABELS = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  python: 'Python',
  py: 'Python',
  python3: 'Python',
  java: 'Java',
  cpp: 'C++',
  'c++': 'C++',
  c: 'C',
};

const normalizeSubmissionLanguage = (language) => {
  const normalized = String(language || 'javascript').toLowerCase();
  return LANGUAGE_LABELS[normalized] || 'JavaScript';
};

const getEffectiveTestCases = (challengeDoc) => {
  if (challengeDoc?.testCases && challengeDoc.testCases.length > 0) {
    return challengeDoc.testCases;
  }

  if (challengeDoc?.exampleInput !== undefined && challengeDoc?.exampleOutput !== undefined) {
    return [
      {
        input: String(challengeDoc.exampleInput),
        output: String(challengeDoc.exampleOutput),
        explanation: 'Auto-generated from challenge example',
      },
    ];
  }

  return [];
};

const splitTopLevel = (text, separator = ',') => {
  const parts = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let quote = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : '';

    if ((ch === '"' || ch === "'") && prev !== '\\') {
      if (!inString) {
        inString = true;
        quote = ch;
      } else if (quote === ch) {
        inString = false;
        quote = '';
      }
      current += ch;
      continue;
    }

    if (!inString) {
      if (ch === '[' || ch === '{' || ch === '(') depth++;
      if (ch === ']' || ch === '}' || ch === ')') depth--;

      if (ch === separator && depth === 0) {
        parts.push(current.trim());
        current = '';
        continue;
      }
    }

    current += ch;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
};

const parseLiteral = (value) => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed.length) return '';
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null') return null;
    if (!Number.isNaN(Number(trimmed))) return Number(trimmed);
    return trimmed;
  }
};

const parseInput = (input) => {
  if (typeof input !== 'string') return input;
  const trimmed = input.trim();

  // 1) Full JSON input
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    // continue
  }

  // 2) Named assignments like: nums1 = [1,3], nums2 = [2]
  if (trimmed.includes('=')) {
    const named = {};
    const parts = splitTopLevel(trimmed, ',');
    parts.forEach((part) => {
      const eqIdx = part.indexOf('=');
      if (eqIdx > 0) {
        const key = part.slice(0, eqIdx).trim();
        const value = part.slice(eqIdx + 1).trim();
        named[key] = parseLiteral(value);
      }
    });
    if (Object.keys(named).length > 0) return named;
  }

  // 3) Fallback raw string
  return trimmed;
};

const normalizeForCompare = (value) => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'number') return Number(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      if (!Number.isNaN(Number(trimmed))) return Number(trimmed);
      return trimmed;
    }
  }
  return value;
};

const valuesFromParsedInput = (parsedInput) => {
  if (Array.isArray(parsedInput)) return parsedInput;
  if (parsedInput && typeof parsedInput === 'object') return Object.values(parsedInput);
  return [parsedInput];
};

const pickCallableFunction = (context) => {
  const preferredOrder = [
    'solveProblem',
    'solution',
    'solve',
    'main',
    'findMedianSortedArrays',
    'twoSum',
    'wordLadder',
  ];

  for (const name of preferredOrder) {
    if (typeof context[name] === 'function') return { name, fn: context[name] };
  }

  const names = Object.keys(context).filter((key) => typeof context[key] === 'function');
  if (names.length > 0) return { name: names[0], fn: context[names[0]] };
  return null;
};

const compareOutputs = (expectedOutput, actualOutput) => {
  const expectedVal = normalizeForCompare(expectedOutput);
  const actualVal = normalizeForCompare(actualOutput);

  if (typeof expectedVal === 'number' && typeof actualVal === 'number') {
    return Math.abs(expectedVal - actualVal) < 0.0001;
  }
  try {
    return JSON.stringify(expectedVal) === JSON.stringify(actualVal);
  } catch (e) {
    return String(expectedVal) === String(actualVal);
  }
};

const executeJavaScriptCase = ({ code, testCase, fileTag }) => {
  const logs = [];
  const parsedInput = parseInput(testCase.input);
  const sandbox = {
    console: {
      log: (...args) => {
        try {
          logs.push(args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' '));
        } catch (e) {
          logs.push(String(args));
        }
      },
    },
    print: (...args) => sandbox.console.log(...args),
    input: parsedInput,
    module: {},
    exports: {},
  };

  if (parsedInput && typeof parsedInput === 'object' && !Array.isArray(parsedInput)) {
    Object.keys(parsedInput).forEach((key) => {
      sandbox[key] = parsedInput[key];
    });
  }

  const context = vm.createContext(sandbox);
  const wrappedCode = `"use strict";\n${code}\n`;
  let actualOutput = null;
  let passed = false;
  const start = Date.now();

  try {
    const script = new vm.Script(wrappedCode, { filename: fileTag });
    script.runInContext(context, { timeout: 1000 });

    const callable = pickCallableFunction(context);
    if (callable) {
      const args = valuesFromParsedInput(parsedInput);
      const invokeResult = callable.fn(...args);
      if (invokeResult !== undefined) actualOutput = invokeResult;
    }

    if (actualOutput === null && logs.length > 0) actualOutput = logs.join('\n');
    if (actualOutput === null) {
      if (context.module && context.module.exports) actualOutput = context.module.exports;
      else if (context.exports) actualOutput = context.exports;
    }

    passed = compareOutputs(testCase.output, actualOutput);
    const executionTime = Date.now() - start;
    return {
      passed,
      actualOutput,
      logs,
      executionTime,
      error: null,
    };
  } catch (err) {
    return {
      passed: false,
      actualOutput: null,
      logs,
      executionTime: Date.now() - start,
      error: err.message,
    };
  }
};

const executePistonCase = async ({ code, language, testCase }) => {
  const runtimeLang = LANGUAGE_ALIASES[String(language || '').toLowerCase()];
  if (!runtimeLang) {
    return {
      passed: false,
      actualOutput: null,
      logs: [],
      executionTime: 0,
      error: `Unsupported language: ${language}`,
    };
  }

  const start = Date.now();
  try {
    const parsedInput = parseInput(testCase.input);
    const stdinPayload =
      typeof parsedInput === 'string' ? parsedInput : JSON.stringify(parsedInput);

    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: runtimeLang,
        version: '*',
        files: [{ content: code }],
        stdin: String(stdinPayload ?? ''),
      }),
    });

    const data = await response.json();
    const run = data?.run || {};
    const stderr = String(run.stderr || '').trim();
    const stdout = String(run.stdout || '').trim();
    const noOutputError =
      !stderr && !stdout
        ? 'No output produced. For C/C++/Java/Python, print the final answer to stdout (or write a main method that reads stdin and prints output).'
        : null;
    const actualOutput = stdout.length ? stdout : null;
    const passed = !stderr && !noOutputError && compareOutputs(testCase.output, stdout);

    return {
      passed,
      actualOutput,
      logs: stdout ? [stdout] : [],
      executionTime: Date.now() - start,
      error: stderr || noOutputError,
    };
  } catch (err) {
    return {
      passed: false,
      actualOutput: null,
      logs: [],
      executionTime: Date.now() - start,
      error: `Language runner error: ${err.message}`,
    };
  }
};

const executeAgainstTestCases = async ({ code, language, testCases, filePrefix = 'submission' }) => {
  const normalizedLanguage = String(language || 'javascript').toLowerCase();
  const isJavaScript = normalizedLanguage === 'javascript' || normalizedLanguage === 'js';

  const testResults = [];
  let testsPassed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const baseResult = isJavaScript
      ? executeJavaScriptCase({
          code,
          testCase,
          fileTag: `${filePrefix}_test${i + 1}.js`,
        })
      : await executePistonCase({
          code,
          language: normalizedLanguage,
          testCase,
        });

    if (baseResult.passed) testsPassed++;

    testResults.push({
      testCase: i + 1,
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: baseResult.actualOutput,
      passed: baseResult.passed,
      error: baseResult.error,
      logs: baseResult.logs,
      executionTime: baseResult.executionTime,
    });
  }

  return { testResults, testsPassed };
};

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

    const effectiveTestCases = getEffectiveTestCases(challenge);
    if (effectiveTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No runnable test data found for this challenge.',
      });
    }

    // Create submission
    const submission = new Submission({
      userId,
      challengeId,
      code,
      language: normalizeSubmissionLanguage(language),
      totalTests: effectiveTestCases.length,
    });
    const { testResults, testsPassed } = await executeAgainstTestCases({
      code,
      language,
      testCases: effectiveTestCases,
      filePrefix: `submission_${submission._id || 'temp'}`,
    });

    submission.testsPassed = testsPassed;
    submission.testResults = testResults;
    submission.status = testsPassed === effectiveTestCases.length ? 'Accepted' : 'Wrong Answer';
    submission.executionTime = testResults.reduce((s, t) => s + (t.executionTime || 0), 0);
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

// Run code quickly without creating a submission (used by frontend 'Run Code')
export const runCode = async (req, res) => {
  try {
    const { challengeId, code, language, testCases } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide code' });
    }

    // Accept either a challengeId (load test cases from DB) or inline testCases
    let challenge;
    let effectiveTestCases = [];
    if (testCases && Array.isArray(testCases)) {
      challenge = { testCases };
    } else {
      if (!challengeId) return res.status(400).json({ success: false, message: 'Please provide challengeId or testCases' });
      challenge = await Challenge.findById(challengeId);
      if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      effectiveTestCases = testCases;
    } else {
      effectiveTestCases = getEffectiveTestCases(challenge);
    }

    if (effectiveTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No runnable test data found for this challenge.',
      });
    }

    const { testResults, testsPassed } = await executeAgainstTestCases({
      code,
      language,
      testCases: effectiveTestCases,
      filePrefix: 'run',
    });

    return res.status(200).json({ success: true, total: effectiveTestCases.length, passed: testsPassed, testResults });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

const buildLeaderboardRows = async (timeRange = 'all') => {
  const now = new Date();
  let fromDate = null;
  if (timeRange === 'today') {
    fromDate = new Date(now);
    fromDate.setHours(0, 0, 0, 0);
  } else if (timeRange === 'week') {
    fromDate = new Date(now);
    fromDate.setDate(now.getDate() - 7);
  } else if (timeRange === 'month') {
    fromDate = new Date(now);
    fromDate.setMonth(now.getMonth() - 1);
  }

  const matchStage = fromDate
    ? [{ $match: { submittedAt: { $gte: fromDate } } }]
    : [];

  const users = await User.find({})
    .select('firstName lastName email profileImage stats')
    .lean();

  const submissionStats = await Submission.aggregate([
    ...matchStage,
    {
      $group: {
        _id: '$userId',
        totalSubmissions: { $sum: 1 },
        acceptedSubmissions: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0],
          },
        },
        solvedChallenges: {
          $addToSet: {
            $cond: [{ $eq: ['$status', 'Accepted'] }, '$challengeId', null],
          },
        },
        lastSubmission: { $max: '$submittedAt' },
      },
    },
    {
      $project: {
        totalSubmissions: 1,
        acceptedSubmissions: 1,
        lastSubmission: 1,
        problemsSolved: {
          $size: {
            $setDifference: ['$solvedChallenges', [null]],
          },
        },
        acceptanceRate: {
          $cond: [
            { $gt: ['$totalSubmissions', 0] },
            {
              $multiply: [
                { $divide: ['$acceptedSubmissions', '$totalSubmissions'] },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
  ]);

  const statMap = new Map(
    submissionStats.map((row) => [String(row._id), row])
  );

  const rows = users.map((user) => {
    const stats = statMap.get(String(user._id));
    return {
      userId: user._id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || '',
      profileImage: user.profileImage || null,
      problemsSolved: stats?.problemsSolved ?? user.stats?.totalProblemsSolved ?? 0,
      totalSubmissions: stats?.totalSubmissions ?? 0,
      acceptanceRate: Number((stats?.acceptanceRate ?? 0).toFixed(2)),
      currentStreak: user.stats?.currentStreak ?? 0,
      lastSubmission: stats?.lastSubmission || null,
    };
  });

  return rows;
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
    const { limit = 50, sortBy = 'solved', timeRange = 'all' } = req.query;

    let leaderboard = await buildLeaderboardRows(timeRange);

    if (sortBy === 'acceptance') {
      leaderboard.sort(
        (a, b) =>
          b.acceptanceRate - a.acceptanceRate ||
          b.problemsSolved - a.problemsSolved
      );
    } else if (sortBy === 'recent') {
      leaderboard.sort(
        (a, b) =>
          new Date(b.lastSubmission || 0) - new Date(a.lastSubmission || 0)
      );
    } else if (sortBy === 'streak') {
      leaderboard.sort(
        (a, b) =>
          b.currentStreak - a.currentStreak ||
          b.problemsSolved - a.problemsSolved
      );
    } else {
      leaderboard.sort(
        (a, b) =>
          b.problemsSolved - a.problemsSolved ||
          b.acceptanceRate - a.acceptanceRate
      );
    }

    leaderboard = leaderboard.slice(0, parseInt(limit, 10));

    leaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

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
    const { timeRange = 'all' } = req.query;
    const leaderboard = await buildLeaderboardRows(timeRange);
    leaderboard.sort(
      (a, b) =>
        b.problemsSolved - a.problemsSolved ||
        b.acceptanceRate - a.acceptanceRate
    );

    const index = leaderboard.findIndex(
      (entry) => String(entry.userId) === String(userId)
    );

    if (index === -1) {
      return res.status(200).json({
        success: true,
        ranking: null,
        message: 'User not found in leaderboard',
      });
    }

    const current = leaderboard[index];

    res.status(200).json({
      success: true,
      ranking: {
        rank: index + 1,
        problemsSolved: current.problemsSolved,
        acceptanceRate: current.acceptanceRate,
        totalSubmissions: current.totalSubmissions,
        currentStreak: current.currentStreak,
        user: {
          firstName: current.firstName,
          lastName: current.lastName,
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
