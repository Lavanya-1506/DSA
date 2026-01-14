import React from 'react';
import './CodePanel.css';

function CodePanel({ code, setCode }) {
  return (
    <div className="code-panel glass fade-in">
      <div className="panel-header">
        <h3>💻 Code Editor</h3>
        <div className="panel-actions">
          <button className="btn run-btn">▶ Run</button>
          <button className="btn reset-btn">🔄 Reset</button>
        </div>
      </div>
      
      <div className="code-editor">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-input"
          spellCheck="false"
        />
      </div>
      
      <div className="output-section">
        <h4>Output:</h4>
        <div className="output-console">
          <pre>Code output will appear here...</pre>
        </div>
      </div>
    </div>
  );
}

export default CodePanel;