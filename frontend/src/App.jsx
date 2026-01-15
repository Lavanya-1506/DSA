import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home/Home';
import SortingVisualizer from './pages/Sorting/SortingVisualizer';
import SearchingVisualizer from './pages/Searching/SearchingVisualizer';
import TreeVisualizer from './pages/Tree/TreeVisualizer';
import StackQueueVisualizer from './pages/StackQueue/StackQueueVisualizer';
import GraphVisualizer from './pages/Graphs/GraphVisualizer';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProfilePage from './pages/Auth/ProfilePage';
import ChallengesPage from './pages/Challenges/ChallengesPage';
import ChallengeDetail from './pages/Challenges/ChallengeDetail';
import LeaderboardPage from './pages/Challenges/LeaderboardPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/sorting" element={
            <ProtectedRoute>
              <SortingVisualizer />
            </ProtectedRoute>
          } />
          <Route path="/searching" element={
            <ProtectedRoute>
              <SearchingVisualizer />
            </ProtectedRoute>
          } />
          <Route path="/trees" element={
            <ProtectedRoute>
              <TreeVisualizer />
            </ProtectedRoute>
          } />
          <Route path="/stack-queue" element={
            <ProtectedRoute>
              <StackQueueVisualizer />
            </ProtectedRoute>
          } />
          <Route path="/graphs" element={
            <ProtectedRoute>
              <GraphVisualizer />
            </ProtectedRoute>
          } />
           <Route path="/challenges" element={
            <ProtectedRoute>
              <ChallengesPage />
            </ProtectedRoute>
          } />

          <Route path="/challenges/:id" element={
            <ProtectedRoute>
              <ChallengeDetail />
            </ProtectedRoute>
          } />


        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;