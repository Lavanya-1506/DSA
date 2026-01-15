import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ControlPanel from '../components/ControlPanel';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ProfilePage from '../pages/Auth/ProfilePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ControlPanel />} />
      <Route path="/data-structure/:type" element={<ControlPanel />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default AppRoutes;