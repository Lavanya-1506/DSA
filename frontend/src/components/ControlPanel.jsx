import React, { useState } from 'react';
import CodePanel from './CodePanel';
import MetricsPanel from './MetricsPanel';
import InputForm from './InputForm';
import ChallengeModal from './ChallengeModal';
import './ControlPanel.css';

function ControlPanel() {
  const [selectedDS, setSelectedDS] = useState('array');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [code, setCode] = useState(
    '// Write your code here\nfunction solveProblem(input) {\n  // Your solution\n  return input;\n}'
  );

  const dataStructures = [
    { id: 'array', name: 'Arrays', icon: 'Array' },
    { id: 'linkedlist', name: 'Linked Lists', icon: 'List' },
    { id: 'tree', name: 'Trees', icon: 'Tree' },
    { id: 'graph', name: 'Graphs', icon: 'Graph' },
    { id: 'stack', name: 'Stacks', icon: 'Stack' },
    { id: 'queue', name: 'Queues', icon: 'Queue' },
  ];

  return (
    <div className="control-panel fade-in">
      <div className="panel-header">
        <h1>Data Structure Simulator</h1>
        <p>Visualize and practice data structures and algorithms</p>
        <button className="challenge-btn pulse" onClick={() => setIsModalOpen(true)}>
          Take Challenge
        </button>
      </div>

      <div className="ds-selector">
        {dataStructures.map((ds) => (
          <div
            key={ds.id}
            className={`ds-card ${selectedDS === ds.id ? 'active' : ''}`}
            onClick={() => setSelectedDS(ds.id)}
          >
            <span className="ds-icon">{ds.icon}</span>
            <span className="ds-name">{ds.name}</span>
          </div>
        ))}
      </div>

      <div className="main-content">
        <div className="left-panel">
          <InputForm selectedDS={selectedDS} />
          <CodePanel
            code={code}
            setCode={setCode}
            challengeId={null}
            testCases={activeChallenge ? activeChallenge.testCases : null}
          />
        </div>

        <div className="right-panel">
          <MetricsPanel selectedDS={selectedDS} />
        </div>
      </div>

      <ChallengeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectChallenge={(challenge) => {
          setActiveChallenge(challenge);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default ControlPanel;
