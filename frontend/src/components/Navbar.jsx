import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/sorting', label: 'Sorting', icon: '📊' },
    { path: '/searching', label: 'Searching', icon: '🔍' },
    { path: '/trees', label: 'Trees', icon: '🌳' },
    { path: '/stack-queue', label: 'Stack & Queue', icon: '📚' },
    { path: '/graphs', label: 'Graphs', icon: '🕸' },
    // { path: '/code-visualizer', label: 'Code Visualizer', icon: '💻' }
    {}
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

        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="profile-menu">
              <button
                className="profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="profile-avatar">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </span>
                <span className="profile-name">{user.firstName}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    👤 My Profile
                  </Link>
                  <button
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                      setIsMenuOpen(false);
                      navigate('/');
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-login">
                Login
              </Link>
              <Link to="/register" className="btn btn-signup">
                Sign Up
              </Link>
            </div>
          )}
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