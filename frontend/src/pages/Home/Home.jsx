import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/protected-routes.css';
import './Home.css';

function Home() {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: '📊',
      title: 'Sorting Algorithms',
      description: 'Visualize bubble sort, quick sort, merge sort and more with step-by-step animations',
      path: '/sorting',
      color: '#667eea'
    },
    {
      icon: '🔍',
      title: 'Searching Algorithms',
      description: 'Understand linear search, binary search with interactive visualizations',
      path: '/searching',
      color: '#764ba2'
    },
    {
      icon: '🌳',
      title: 'Tree Structures',
      description: 'Explore binary trees, BST operations with beautiful tree visualizations',
      path: '/trees',
      color: '#f093fb'
    },
    {
      icon: '📚',
      title: 'Stack & Queue',
      description: 'Visualize LIFO and FIFO operations with interactive examples',
      path: '/stack-queue',
      color: '#4facfe'
    },
    {
      icon: '🕸',
      title: 'Graph Algorithms',
      description: 'Understand BFS, DFS and pathfinding algorithms visually',
      path: '/graphs',
      color: '#43e97b'
    }
  ];

  const stats = [
    { number: '10+', label: 'Algorithms' },
    { number: '5', label: 'Data Structures' },
    { number: '∞', label: 'Visualizations' },
    { number: '100%', label: 'Interactive' }
  ];

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Master <span className="gradient-text">Data Structures</span> & Algorithms
          </h1>
          <p className="hero-subtitle">
            Interactive visualizations that make complex algorithms easy to understand. 
            Learn by seeing how data structures work in real-time.
          </p>
          <div className="hero-buttons">
            <Link to="/sorting" className="btn primary-btn">
              🚀 Start Learning
            </Link>
            <button className="btn secondary-btn">
              📚 View Challenges
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="floating-node">1</div>
            <div className="floating-node">2</div>
            <div className="floating-node">3</div>
            <div className="floating-node">4</div>
            <div className="floating-node">5</div>
          </div>
        </div>
      </section>

      {/* Login Reminder for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="login-reminder">
          <h3>🔐 Unlock Full Access</h3>
          <p>Sign up or log in to access all algorithm visualizers and track your progress!</p>
          <Link to="/register">Create Free Account</Link>
          <span style={{ margin: '0 10px', opacity: 0.8 }}>or</span>
          <Link to="/login">Log In</Link>
        </div>
      )}

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card slide-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Explore Data Structures</h2>
        <p className="section-subtitle">
          {isAuthenticated 
            ? 'Choose a category to start visualizing and understanding algorithms'
            : 'Sign in to unlock all features'
          }
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            isAuthenticated ? (
              <Link
                key={index}
                to={feature.path}
                className="feature-card slide-in"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  '--card-color': feature.color
                }}
              >
                <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </Link>
            ) : (
              <div
                key={index}
                className="feature-card slide-in locked"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  '--card-color': feature.color
                }}
              >
                <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="lock-badge">🔒 Sign In to Access</div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section glass">
        <div className="cta-content">
          <h2>Ready to Master DSA?</h2>
          <p>Start your journey with interactive visualizations and step-by-step guidance</p>
          {isAuthenticated ? (
            <Link to="/sorting" className="btn primary-btn large">
              🎯 Start Learning Now
            </Link>
          ) : (
            <Link to="/register" className="btn primary-btn large">
              🚀 Get Started Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;