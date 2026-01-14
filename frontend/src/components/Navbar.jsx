import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/sorting', label: 'Sorting', icon: '📊' },
    { path: '/searching', label: 'Searching', icon: '🔍' },
    { path: '/trees', label: 'Trees', icon: '🌳' },
    { path: '/stack-queue', label: 'Stack & Queue', icon: '📚' },
    { path: '/graphs', label: 'Graphs', icon: '🕸' },
    { path: '/code-visualizer', label: 'Code Visualizer', icon: '💻' }
  ];

  return (
    <nav className="navbar glass fade-in">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-placeholder">🧮</div>
          <span>DSA Stimulator</span>
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;