import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { challengeAPI } from '../../utils/challengeAPI';
import './ChallengesPage.css';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = [
    'All',
    'Sorting',
    'Searching',
    'Trees',
    'Graphs',
    'Stacks',
    'Queues',
    'Dynamic Programming',
  ];

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      console.log('Fetching challenges from:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
      const data = await challengeAPI.getAllChallenges();
      console.log('Challenges fetched:', data);
      setChallenges(data);
      setFilteredChallenges(data);
      setError('');
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err.message || 'Failed to load challenges. Make sure backend is running.');
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = challenges;

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter((c) => c.difficulty === selectedDifficulty);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChallenges(filtered);
  }, [challenges, selectedDifficulty, selectedCategory, searchTerm]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'difficulty-easy';
      case 'Medium':
        return 'difficulty-medium';
      case 'Hard':
        return 'difficulty-hard';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="challenges-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges-page">
      <div className="challenges-header">
        <h1>DSA Challenges</h1>
        <p>Solve problems, track your progress, and climb the leaderboard!</p>
      </div>

      <div className="challenges-container">
        {/* Sidebar Filters */}
        <div className="challenges-sidebar">
          <div className="filter-section">
            <h3>Difficulty</h3>
            <div className="filter-options">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  className={`filter-btn ${
                    selectedDifficulty === diff ? 'active' : ''
                  }`}
                  onClick={() => setSelectedDifficulty(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Category</h3>
            <div className="filter-options category-grid">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${
                    selectedCategory === cat ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="challenges-main">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search challenges by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Challenges List */}
          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
            </div>
          )}

          {filteredChallenges.length === 0 ? (
            <div className="no-challenges">
              <p>No challenges found matching your criteria.</p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSelectedDifficulty('All');
                  setSelectedCategory('All');
                  setSearchTerm('');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="challenges-grid">
              {filteredChallenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className="challenge-card"
                  onClick={() =>
                    navigate(`/challenges/${challenge._id}`, {
                      state: { challenge },
                    })
                  }
                >
                  <div className="challenge-header">
                    <h3>{challenge.title}</h3>
                    <span
                      className={`difficulty-badge ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  <p className="challenge-description">{challenge.description}</p>

                  <div className="challenge-meta">
                    <span className="category-tag">{challenge.category}</span>
                  </div>

                  <div className="challenge-stats">
                    <div className="stat">
                      <span className="stat-label">Attempts:</span>
                      <span className="stat-value">
                        {challenge.stats?.totalAttempts || 0}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Accepted:</span>
                      <span className="stat-value">
                        {challenge.stats?.totalSolutions || 0}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Acceptance:</span>
                      <span className="stat-value">
                        {challenge.stats?.acceptanceRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <button className="solve-btn">Solve Challenge</button>
                </div>
              ))}
            </div>
          )}

          <div className="challenges-footer">
            <p>
              Total Challenges: {filteredChallenges.length} /{' '}
              {challenges.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
