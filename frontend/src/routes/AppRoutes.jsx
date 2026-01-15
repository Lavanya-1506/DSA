import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ControlPanel from '../components/ControlPanel';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ProfilePage from '../pages/Auth/ProfilePage';
import ChallengesPage from '../pages/Challenges/ChallengesPage';
import ChallengeDetail from '../pages/Challenges/ChallengeDetail';
import LeaderboardPage from '../pages/Challenges/LeaderboardPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ControlPanel />} />
      <Route path="/data-structure/:type" element={<ControlPanel />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/challenges" element={<ChallengesPage />} />
      <Route path="/challenges/:id" element={<ChallengeDetail />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
    </Routes>
  );
}

export default AppRoutes;