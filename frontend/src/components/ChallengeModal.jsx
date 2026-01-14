import React from 'react';
import './ChallengeModal.css';

function ChallengeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const challenges = [
    {
      title: "Array Rotation",
      difficulty: "Easy",
      points: 100,
      description: "Rotate an array by k positions"
    },
    {
      title: "Linked List Cycle",
      difficulty: "Medium",
      points: 200,
      description: "Detect cycle in a linked list"
    },
    {
      title: "Binary Tree Traversal",
      difficulty: "Medium",
      points: 250,
      description: "Implement inorder traversal without recursion"
    },
    {
      title: "Graph Shortest Path",
      difficulty: "Hard",
      points: 500,
      description: "Find shortest path using Dijkstra's algorithm"
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
                <button className="start-btn">Start Challenge</button>
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