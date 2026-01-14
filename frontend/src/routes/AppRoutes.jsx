import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ControlPanel from '../components/ControlPanel';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ControlPanel />} />
      <Route path="/data-structure/:type" element={<ControlPanel />} />
    </Routes>
  );
}

export default AppRoutes;