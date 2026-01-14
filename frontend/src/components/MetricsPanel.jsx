import React from 'react';
import './MetricsPanel.css';

function MetricsPanel({ selectedDS }) {
  const metrics = {
    array: [
      { label: 'Time Complexity', value: 'O(n)', best: 'O(1)', worst: 'O(n)' },
      { label: 'Space Complexity', value: 'O(n)', best: 'O(1)', worst: 'O(n)' },
      { label: 'Operations', value: 'Access: O(1)', details: 'Search: O(n), Insert: O(n)' }
    ],
    linkedlist: [
      { label: 'Time Complexity', value: 'O(n)', best: 'O(1)', worst: 'O(n)' },
      { label: 'Space Complexity', value: 'O(n)', best: 'O(1)', worst: 'O(n)' },
      { label: 'Operations', value: 'Insert: O(1)', details: 'Search: O(n), Delete: O(1)' }
    ]
  };

  const currentMetrics = metrics[selectedDS] || metrics.array;

  return (
    <div className="metrics-panel glass fade-in">
      <h3>📊 Performance Metrics</h3>
      
      <div className="metrics-grid">
        {currentMetrics.map((metric, index) => (
          <div 
            key={index} 
            className="metric-card slide-in" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            {metric.details && (
              <div className="metric-details">{metric.details}</div>
            )}
            {metric.best && (
              <div className="complexity-breakdown">
                <span className="best">Best: {metric.best}</span>
                <span className="worst">Worst: {metric.worst}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="visualization">
        <h4>📈 Real-time Visualization</h4>
        <div className="visualization-placeholder">
          <p>Data structure visualization will appear here</p>
          <div className="animation-preview">
            <div className="node">1</div>
            <div className="node">2</div>
            <div className="node">3</div>
            <div className="node">4</div>
            <div className="node">5</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsPanel;