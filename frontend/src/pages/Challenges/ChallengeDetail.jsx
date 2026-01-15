import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { challengeAPI, submissionAPI } from '../../utils/challengeAPI';
import { useAuth } from '../../context/AuthContext';
import './ChallengeDetail.css';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [challenge, setChallenge] = useState(location.state?.challenge || null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [loading, setLoading] = useState(!challenge);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('problem');
  const [error, setError] = useState('');

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'Go'];

  const sampleCodes = {
    JavaScript:
      'function solve(input) {\n  // Write your solution here\n  return result;\n}',
    Python: 'def solve(input):\n    # Write your solution here\n    return result',
    Java: 'class Solution {\n  public solve(String input) {\n    // Write your solution here\n    return result;\n  }\n}',
    'C++': '#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your solution here\n  return 0;\n}',
    Go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  // Write your solution here\n}',
  };

  useEffect(() => {
    if (!challenge) {
      fetchChallenge();
    }
    setCode(sampleCodes[language]);
  }, []);

  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const data = await challengeAPI.getChallenge(id);
      setChallenge(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(sampleCodes[newLanguage]);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in to submit a solution');
      navigate('/login');
      return;
    }

    if (!code.trim()) {
      alert('Please write some code');
      return;
    }

    try {
      setSubmitting(true);
      const response = await submissionAPI.submitSolution(
        challenge._id,
        code,
        language
      );
      setResult(response);
    } catch (err) {
      alert('Error submitting solution: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="challenge-detail">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="challenge-detail">
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={() => navigate('/challenges')}>
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="challenge-detail">
        <div className="error-container">
          <p>Challenge not found</p>
          <button onClick={() => navigate('/challenges')}>
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="challenge-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/challenges')}>
          ← Back to Challenges
        </button>
        <div className="title-section">
          <h1>{challenge.title}</h1>
          <span
            className={`difficulty-badge difficulty-${challenge.difficulty.toLowerCase()}`}
          >
            {challenge.difficulty}
          </span>
        </div>
      </div>

      <div className="detail-container">
        {/* Left Panel - Problem Description */}
        <div className="problem-panel">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'problem' ? 'active' : ''}`}
              onClick={() => setActiveTab('problem')}
            >
              Problem
            </button>
            <button
              className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
          </div>

          {activeTab === 'problem' && (
            <div className="problem-content">
              <section className="content-section">
                <h2>Description</h2>
                <p>{challenge.description}</p>
              </section>

              {challenge.examples && challenge.examples.length > 0 && (
                <section className="content-section">
                  <h2>Examples</h2>
                  {challenge.examples.map((example, idx) => (
                    <div key={idx} className="example">
                      <div className="example-part">
                        <strong>Input {idx + 1}:</strong>
                        <code>{JSON.stringify(example.input)}</code>
                      </div>
                      <div className="example-part">
                        <strong>Output {idx + 1}:</strong>
                        <code>{JSON.stringify(example.output)}</code>
                      </div>
                      {example.explanation && (
                        <div className="example-part">
                          <strong>Explanation:</strong>
                          <p>{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {challenge.constraints && (
                <section className="content-section">
                  <h2>Constraints</h2>
                  <ul>
                    {challenge.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </section>
              )}

              {challenge.hints && challenge.hints.length > 0 && (
                <section className="content-section">
                  <h2>Hints</h2>
                  <ul>
                    {challenge.hints.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="content-section stats-section">
                <h3>Problem Stats</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Attempts:</span>
                    <span className="stat-value">
                      {challenge.stats?.totalAttempts || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Solutions:</span>
                    <span className="stat-value">
                      {challenge.stats?.totalSolutions || 0}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Acceptance Rate:</span>
                    <span className="stat-value">
                      {challenge.stats?.acceptanceRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Category:</span>
                    <span className="stat-value">{challenge.category}</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="submissions-content">
              <p>Submission history will appear here</p>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="code-panel">
          <div className="code-header">
            <div className="language-selector">
              <label htmlFor="language">Language:</label>
              <select
                id="language"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            spellCheck="false"
          />

          <div className="code-actions">
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>
            <button
              className="reset-btn"
              onClick={() => setCode(sampleCodes[language])}
            >
              Reset Code
            </button>
          </div>

          {result && (
            <div
              className={`submission-result ${
                result.status === 'Accepted' ? 'success' : 'error'
              }`}
            >
              <h3>Submission Result</h3>
              <div className="result-content">
                <p>
                  <strong>Status:</strong> {result.status}
                </p>
                <p>
                  <strong>Language:</strong> {result.language}
                </p>
                {result.testResults && (
                  <div>
                    <p>
                      <strong>Tests Passed:</strong>{' '}
                      {result.testResults.filter((t) => t.passed).length} /{' '}
                      {result.testResults.length}
                    </p>
                    <div className="test-results">
                      {result.testResults.map((test, idx) => (
                        <div
                          key={idx}
                          className={`test-result ${
                            test.passed ? 'passed' : 'failed'
                          }`}
                        >
                          <span className="test-number">Test {idx + 1}:</span>
                          <span className="test-status">
                            {test.passed ? '✓ Passed' : '✗ Failed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.executionTime && (
                  <p>
                    <strong>Execution Time:</strong> {result.executionTime}ms
                  </p>
                )}
                {result.message && (
                  <p className="result-message">{result.message}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
