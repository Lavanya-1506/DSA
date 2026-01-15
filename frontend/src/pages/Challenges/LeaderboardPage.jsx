import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../../utils/challengeAPI';
import { useAuth } from '../../context/AuthContext';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRanking, setUserRanking] = useState(null);
  const [sortBy, setSortBy] = useState('solved');
  const [timeRange, setTimeRange] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchUserRanking();
    }
  }, [sortBy, timeRange, user]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const query = `?sortBy=${sortBy}&timeRange=${timeRange}&limit=100`;
      const data = await leaderboardAPI.getDetailedLeaderboard();
      setLeaderboard(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRanking = async () => {
    try {
      const data = await leaderboardAPI.getUserRanking();
      setUserRanking(data);
    } catch (err) {
      console.error('Error fetching user ranking:', err);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'rank-first';
    if (rank === 2) return 'rank-second';
    if (rank === 3) return 'rank-third';
    return '';
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Compete with others and showcase your problem-solving skills</p>
      </div>

      {/* User's Current Ranking */}
      {user && userRanking && (
        <div className="user-ranking-card">
          <h2>Your Ranking</h2>
          <div className="ranking-content">
            <div className="ranking-stat">
              <span className="ranking-label">Rank</span>
              <span className="ranking-value">#{userRanking.rank}</span>
            </div>
            <div className="ranking-stat">
              <span className="ranking-label">Problems Solved</span>
              <span className="ranking-value">{userRanking.problemsSolved}</span>
            </div>
            <div className="ranking-stat">
              <span className="ranking-label">Acceptance Rate</span>
              <span className="ranking-value">
                {userRanking.acceptanceRate?.toFixed(1)}%
              </span>
            </div>
            <div className="ranking-stat">
              <span className="ranking-label">Total Submissions</span>
              <span className="ranking-value">
                {userRanking.totalSubmissions}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-controls">
        <div className="control-group">
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="solved">Problems Solved</option>
            <option value="acceptance">Acceptance Rate</option>
            <option value="recent">Recent Activity</option>
            <option value="streak">Streak</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="timeRange">Time Range:</label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
            <option value="today">Today</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <p>No users on the leaderboard yet. Start solving problems!</p>
        </div>
      ) : (
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="rank-col">Rank</th>
                <th className="name-col">User</th>
                <th className="solved-col">Solved</th>
                <th className="acceptance-col">Acceptance</th>
                <th className="submissions-col">Submissions</th>
                <th className="streak-col">Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr
                  key={entry.userId}
                  className={`leaderboard-row ${getRankColor(idx + 1)} ${
                    user && entry.userId === user._id ? 'current-user' : ''
                  }`}
                >
                  <td className="rank-col">
                    <div className="rank-cell">
                      {getMedalEmoji(idx + 1)}
                      <span className="rank-number">{idx + 1}</span>
                    </div>
                  </td>
                  <td className="name-col">
                    <div className="user-info">
                      <div className="user-avatar">
                        {entry.username[0].toUpperCase()}
                      </div>
                      <div className="user-details">
                        <div className="user-name">
                          {entry.username}
                          {user && entry.userId === user._id && (
                            <span className="you-badge">(You)</span>
                          )}
                        </div>
                        <div className="user-email">{entry.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="solved-col">
                    <span className="solved-value">
                      {entry.problemsSolved}
                    </span>
                  </td>
                  <td className="acceptance-col">
                    <div className="acceptance-bar">
                      <div className="acceptance-fill">
                        <span className="acceptance-text">
                          {entry.acceptanceRate?.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="submissions-col">{entry.totalSubmissions}</td>
                  <td className="streak-col">
                    <span className="streak-value">
                      🔥 {entry.currentStreak || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="leaderboard-legend">
        <div className="legend-item">
          <span className="legend-icon">🥇</span>
          <span>1st Place - Gold</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🥈</span>
          <span>2nd Place - Silver</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🥉</span>
          <span>3rd Place - Bronze</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🔥</span>
          <span>Days with submissions</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
