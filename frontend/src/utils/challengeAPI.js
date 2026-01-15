const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
};

// Challenge API calls
export const challengeAPI = {
  // Get all challenges
  getAllChallenges: (query = '') =>
    apiCall(`/challenges${query}`, { method: 'GET' }),

  // Get single challenge
  getChallenge: (id) =>
    apiCall(`/challenges/${id}`, { method: 'GET' }),

  // Get challenges by difficulty
  getChallengesByDifficulty: (difficulty) =>
    apiCall(`/challenges/difficulty/${difficulty}`, { method: 'GET' }),

  // Get challenges by category
  getChallengesByCategory: (category) =>
    apiCall(`/challenges/category/${category}`, { method: 'GET' }),

  // Create challenge (admin only)
  createChallenge: (challengeData) =>
    apiCall('/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    }),

  // Update challenge (admin only)
  updateChallenge: (id, challengeData) =>
    apiCall(`/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(challengeData),
    }),

  // Delete challenge (admin only)
  deleteChallenge: (id) =>
    apiCall(`/challenges/${id}`, { method: 'DELETE' }),
};

// Submission API calls
export const submissionAPI = {
  // Submit solution
  submitSolution: (challengeId, code, language = 'JavaScript') =>
    apiCall('/submissions', {
      method: 'POST',
      body: JSON.stringify({
        challengeId,
        code,
        language,
      }),
    }),

  // Get user submissions
  getUserSubmissions: () =>
    apiCall('/submissions/user', { method: 'GET' }),

  // Get single submission
  getSubmission: (id) =>
    apiCall(`/submissions/${id}`, { method: 'GET' }),

  // Get challenge submissions
  getChallengeSubmissions: (challengeId) =>
    apiCall(`/submissions/challenge/${challengeId}`, { method: 'GET' }),

  // Get user challenge progress
  getUserChallengeProgress: () =>
    apiCall('/submissions/user/progress', { method: 'GET' }),
};

// Leaderboard API calls
export const leaderboardAPI = {
  // Get leaderboard
  getLeaderboard: (query = '') =>
    apiCall(`/leaderboard${query}`, { method: 'GET' }),

  // Get detailed leaderboard
  getDetailedLeaderboard: (limit = 50) =>
    apiCall(`/leaderboard/detailed?limit=${limit}`, { method: 'GET' }),

  // Get user ranking
  getUserRanking: () =>
    apiCall('/leaderboard/user-ranking', { method: 'GET' }),
};
