import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { challengeAPI, submissionAPI } from '../../utils/challengeAPI';
import CodeEditor from '../../components/CodeEditor';
import './ChallengesPage.css';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [tempDifficulty, setTempDifficulty] = useState('All');
  const [tempCategory, setTempCategory] = useState('All');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = [
    'All',
    'Sorting',
    'Searching',
    'Trees',
    'Graphs',
    'Stack & Queue',
    'Dynamic Programming',
  ];

  useEffect(() => {
    fetchChallenges();
  }, []);

  // Handle category from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      // Map URL param to category name
      const categoryMap = {
        'sorting': 'Sorting',
        'searching': 'Searching',
        'trees': 'Trees',
        'graphs': 'Graphs',
        'stack-queue': 'Stack & Queue',
        'dynamic-programming': 'Dynamic Programming'
      };
      const mappedCategory = categoryMap[categoryFromUrl.toLowerCase()];
      if (mappedCategory) {
        setTempCategory(mappedCategory);
        setSelectedCategory(mappedCategory);
      }
    }
  }, [searchParams]);

  const applyFilters = () => {
    console.log('Applying filters:', { tempDifficulty, tempCategory, tempSearchTerm });
    console.log('Current challenges count:', challenges.length);
    setSelectedDifficulty(tempDifficulty);
    setSelectedCategory(tempCategory);
    setSearchTerm(tempSearchTerm);
  };

  const resetFilters = () => {
    setTempDifficulty('All');
    setTempCategory('All');
    setTempSearchTerm('');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
    setSearchTerm('');
  };

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      console.log('Fetching challenges from:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
      const data = await challengeAPI.getAllChallenges();
      console.log('Challenges fetched:', data);
      
      // Extract challenges from response - API returns { success, count, challenges }
      let challengesArray = [];
      if (Array.isArray(data)) {
        challengesArray = data;
      } else if (data && data.challenges && Array.isArray(data.challenges)) {
        challengesArray = data.challenges;
      } else if (data && data.data && Array.isArray(data.data)) {
        challengesArray = data.data;
      }
      
      console.log('Extracted challenges array with length:', challengesArray.length);
      if (challengesArray.length > 0) {
        console.log('First challenge:', challengesArray[0]);
      }
      
      setChallenges(challengesArray);
      setError('');
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err.message || 'Failed to load challenges. Make sure backend is running.');
      setChallenges([]);
      setFilteredChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!challenges || challenges.length === 0) {
      console.log('No challenges to filter');
      setFilteredChallenges([]);
      return;
    }

    console.log('=== Starting filter logic ===');
    console.log('Total challenges:', challenges.length);
    console.log('Filters:', { selectedDifficulty, selectedCategory, searchTerm });

    let filtered = [...challenges];

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      const beforeCount = filtered.length;
      filtered = filtered.filter((c) => {
        console.log(`Challenge "${c.title}" difficulty: ${c.difficulty}, looking for: ${selectedDifficulty}`);
        return c.difficulty === selectedDifficulty;
      });
      console.log(`After difficulty filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      const beforeCount = filtered.length;
      filtered = filtered.filter((c) => {
        console.log(`Challenge "${c.title}" category: ${c.category}, looking for: ${selectedCategory}`);
        return c.category === selectedCategory;
      });
      console.log(`After category filter: ${beforeCount} -> ${filtered.length}`);
    }

    // Filter by search term
    if (searchTerm) {
      const beforeCount = filtered.length;
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`After search filter: ${beforeCount} -> ${filtered.length}`);
    }

    console.log('Final filtered challenges count:', filtered.length);
    console.log('=== End filter logic ===');
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
                    tempDifficulty === diff ? 'active' : ''
                  }`}
                  onClick={() => setTempDifficulty(diff)}
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
                    tempCategory === cat ? 'active' : ''
                  }`}
                  onClick={() => setTempCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <button className="apply-btn" onClick={applyFilters}>Apply Filters</button>
            <button className="reset-btn" onClick={resetFilters}>Reset All</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="challenges-main">
          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search challenges by title or description..."
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn" onClick={applyFilters}>Search</button>
          </div>

          {/* Challenges List */}
          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
            </div>
          )}

          {filteredChallenges && filteredChallenges.length === 0 ? (
            <div className="no-challenges">
              <p>No challenges found matching your criteria.</p>
              <button
                className="reset-btn"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="challenges-grid">
              {Array.isArray(filteredChallenges) && filteredChallenges.map((challenge) => (
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
                        {challenge.stats?.acceptanceRate ? challenge.stats.acceptanceRate.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </div>

                  <button 
                    className="solve-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChallenge(challenge);
                      setShowEditor(true);
                    }}
                  >
                    Solve Challenge
                  </button>
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

      {/* Code Editor Modal */}
      {showEditor && selectedChallenge && (
        <CodeEditor
          challenge={selectedChallenge}
          onClose={() => {
            setShowEditor(false);
            setSelectedChallenge(null);
          }}
        />
      )}
    </div>
  );
};

export default ChallengesPage;
