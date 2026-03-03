import React from 'react';
import './ChallengeModal.css';

function ChallengeModal({ isOpen, onClose, onSelectChallenge }) {
  if (!isOpen) return null;

  const challenges = [
    {
      title: "Median Two Arrays",
      difficulty: "Medium",
      points: 300,
      description: "Find median of two sorted arrays",
      testCases: [
        { input: "[1,3]# [2]", output: "2" },
        { input: "[1,2]# [3,4]", output: "2.5" },
        { input: "[]# [1]", output: "1" }
      ]
    },
    {
      title: "Array Rotation",
      difficulty: "Easy",
      points: 100,
      description: "Rotate an array by k positions",
      testCases: [
        { input: "[1,2,3,4]#2", output: "[3,4,1,2]" }
      ]
    },
    {
      title: "Linked List Cycle",
      difficulty: "Medium",
      points: 200,
      description: "Detect cycle in a linked list",
      testCases: [
        { input: "1->2->3->4", output: "false" }
      ]
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#f44336';
      default: return '#667eea';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏆 Coding Challenges</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="challenges-grid">
          {challenges.map((challenge, index) => (
            <div 
              key={index} 
              className="challenge-card slide-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="challenge-header">
                <h3>{challenge.title}</h3>
                <span 
                  className="difficulty-badge"
                  style={{backgroundColor: getDifficultyColor(challenge.difficulty)}}
                >
                  {challenge.difficulty}
                </span>
              </div>
              <p className="challenge-description">{challenge.description}</p>
              <div className="challenge-footer">
                <span className="points">⭐ {challenge.points} points</span>
                <button className="start-btn" onClick={() => onSelectChallenge && onSelectChallenge(challenge)}>Start Challenge</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="modal-footer">
          <button className="btn secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChallengeModal;