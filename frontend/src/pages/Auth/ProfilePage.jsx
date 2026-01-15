import React, { useState, useEffect } from 'react';
import { authAPI, getAuthUser } from '../../utils/api';
import './Auth.css';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    githubProfile: '',
    linkedinProfile: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.user);
      setFormData({
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        bio: response.user.bio || '',
        githubProfile: response.user.githubProfile || '',
        linkedinProfile: response.user.linkedinProfile || '',
        country: response.user.country || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile(formData);
      setUser(response.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!user) {
    return <div className="profile-container">User not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <div className="avatar-placeholder">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <p>{user.email}</p>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className="btn-edit">
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Bio:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                maxLength="500"
              />
            </div>
            <div className="form-group">
              <label>GitHub Profile:</label>
              <input
                type="url"
                name="githubProfile"
                value={formData.githubProfile}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn Profile:</label>
              <input
                type="url"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-section">
              <h3>About</h3>
              <p>{user.bio || 'No bio added yet'}</p>
            </div>

            <div className="detail-section">
              <h3>Statistics</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-label">Problems Attempted</span>
                  <span className="stat-value">{user.stats.totalProblemsAttempted}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Problems Solved</span>
                  <span className="stat-value">{user.stats.totalProblemsSolved}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Current Streak</span>
                  <span className="stat-value">{user.stats.currentStreak}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Longest Streak</span>
                  <span className="stat-value">{user.stats.longestStreak}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Social Links</h3>
              <div className="social-links">
                {user.githubProfile && (
                  <a href={user.githubProfile} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {user.linkedinProfile && (
                  <a href={user.linkedinProfile} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>Account Info</h3>
              <p>
                <strong>Joined:</strong>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
              {user.country && (
                <p>
                  <strong>Country:</strong> {user.country}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
