import React, { useState } from 'react';
import CodePanel from './CodePanel';
import MetricsPanel from './MetricsPanel';
import InputForm from './InputForm';
import ChallengeModal from './ChallengeModal';
import './ControlPanel.css';

function ControlPanel() {
  const [selectedDS, setSelectedDS] = useState('array');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('// Write your code here\nfunction solveProblem(input) {\n  // Your solution\n  return input;\n}');

  const dataStructures = [
    { id: 'array', name: 'Arrays', icon: '📊' },
    { id: 'linkedlist', name: 'Linked Lists', icon: '🔗' },
    { id: 'tree', name: 'Trees', icon: '🌳' },
    { id: 'graph', name: 'Graphs', icon: '🕸' },
    { id: 'stack', name: 'Stacks', icon: '📚' },
    { id: 'queue', name: 'Queues', icon: '🎯' }
  ];

  return (
    <div className="control-panel fade-in">
      <div className="panel-header">
        <h1>Data Structure Simulator</h1>
        <p>Visualize and practice data structures and algorithms</p>
        <button 
          className="challenge-btn pulse"
          onClick={() => setIsModalOpen(true)}
        >
          🏆 Take Challenge
        </button>
      </div>

      <div className="ds-selector">
		// ...existing code...
{dataStructures.map(ds => (
  <div
    key={ds.id}
    className={`ds-card ${selectedDS === ds.id ? 'active' : ''}`}
    onClick={() => setSelectedDS(ds.id)}
  >
    <span className="ds-icon">{ds.icon}</span>
    <span className="ds-name">{ds.name}</span>
  </div>
))}
// ...existing code...
     
      </div>

      <div className="main-content">
        <div className="left-panel">
          <InputForm selectedDS={selectedDS} />
          <CodePanel code={code} setCode={setCode} />
        </div>
        
        <div className="right-panel">
          <MetricsPanel selectedDS={selectedDS} />
        </div>
      </div>

      <ChallengeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default ControlPanel;