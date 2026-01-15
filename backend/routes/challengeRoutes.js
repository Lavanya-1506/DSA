import express from 'express';
import {
  getAllChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getChallengesByDifficulty,
  getChallengesByCategory,
  getUserChallengeProgress,
} from '../controllers/challengeController.js';
import {
  submitSolution,
  getChallengeSubmissions,
  getUserSubmissions,
  getSubmission,
  getLeaderboard,
  getDetailedLeaderboard,
  getUserRanking,
} from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Challenge Routes
router.get('/challenges', getAllChallenges);
router.get('/challenges/difficulty/:difficulty', getChallengesByDifficulty);
router.get('/challenges/category/:category', getChallengesByCategory);
router.get('/challenges/:id', getChallenge);
router.post('/challenges', protect, authorize('admin'), createChallenge);
router.put('/challenges/:id', protect, authorize('admin'), updateChallenge);
router.delete('/challenges/:id', protect, authorize('admin'), deleteChallenge);

// Submission Routes
router.post('/submissions', protect, submitSolution);
router.get('/submissions/user', protect, getUserSubmissions);
router.get('/submissions/user/progress', protect, getUserChallengeProgress);
router.get('/submissions/:id', protect, getSubmission);
router.get('/submissions/challenge/:challengeId', getChallengeSubmissions);

// Leaderboard Routes
router.get('/leaderboard', getLeaderboard);
router.get('/leaderboard/detailed', getDetailedLeaderboard);
router.get('/leaderboard/user-ranking', protect, getUserRanking);

export default router;
