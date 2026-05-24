import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { challengeAPI } from '../../utils/challengeAPI';
import './ChallengesPage.css';

const CompanyQuestions = () => {
  const { company } = useParams();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await challengeAPI.getChallengesByCompany(company);
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else if (data && data.challenges) arr = data.challenges;
        setChallenges(arr);
      } catch (err) {
        setError(err.message || 'Failed to load company challenges');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [company]);

  if (loading) return <div className="challenges-page"><p>Loading company questions...</p></div>;
  if (error) return <div className="challenges-page"><p>Error: {error}</p></div>;

  return (
    <div className="challenges-page">
      <div className="challenges-header">
        <h1>{company} — Interview Questions</h1>
        <p>Curated DSA questions commonly asked at {company}.</p>
      </div>

      <div className="challenges-grid">
        {challenges.map((challenge) => (
          <div
            key={challenge._id}
            className="challenge-card"
            onClick={() => navigate(`/challenges/${challenge._id}`)}
          >
            <div className="challenge-header">
              <h3>{challenge.title}</h3>
              <span className={`difficulty-badge ${challenge.difficulty === 'Easy' ? 'difficulty-easy' : challenge.difficulty === 'Medium' ? 'difficulty-medium' : 'difficulty-hard'}`}>
                {challenge.difficulty}
              </span>
            </div>

            <p className="challenge-description">{challenge.description}</p>

            <div className="challenge-meta">
              <span className="category-tag">{challenge.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyQuestions;
