import React, { useState } from 'react';
import './SortingVisualizer.css';

function SortingVisualizer() {
  const [array, setArray] = useState(generateRandomArray());
  const [isSorting, setIsSorting] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');

  function generateRandomArray() {
    return Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 10);
  }

  const algorithms = [
    { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n²)' },
    { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)' },
    { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)' }
  ];

  const handleSort = async () => {
    setIsSorting(true);
    // Simulate sorting animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const sortedArray = [...array].sort((a, b) => a - b);
    setArray(sortedArray);
    setIsSorting(false);
  };

  const resetArray = () => {
    setArray(generateRandomArray());
  };

  return (
    <div className="sorting-visualizer fade-in">
      <div className="visualizer-header">
        <h1>Sorting Algorithms</h1>
        <p>Visualize how different sorting algorithms work step by step</p>
      </div>

      <div className="control-panel glass">
        <div className="algorithm-selector">
          <label>Select Algorithm:</label>
          <select 
            value={selectedAlgorithm} 
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isSorting}
          >
            {algorithms.map(algo => (
              <option key={algo.id} value={algo.id}>
                {algo.name} ({algo.complexity})
              </option>
            ))}
          </select>
        </div>

        <div className="control-buttons">
          <button 
            className="btn primary-btn" 
            onClick={handleSort}
            disabled={isSorting}
          >
            {isSorting ? 'Sorting...' : '🚀 Start Sorting'}
          </button>
          <button 
            className="btn secondary-btn" 
            onClick={resetArray}
            disabled={isSorting}
          >
            🔄 New Array
          </button>
          <button className="btn secondary-btn">
            ⏸ Pause
          </button>
        </div>
      </div>

      <div className="visualization-area">
        <div className="array-container">
          {array.map((value, index) => (
            <div
              key={index}
              className="array-bar"
              style={{ 
                height: `${value}%`,
                backgroundColor: `hsl(${value * 3}, 70%, 60%)`
              }}
            >
              <span className="bar-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-panel glass">
        <h3>Algorithm Information</h3>
        <div className="algorithm-info">
          <div className="info-item">
            <span className="info-label">Time Complexity:</span>
            <span className="info-value">O(n²)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Space Complexity:</span>
            <span className="info-value">O(1)</span>
          </div>
          <div className="info-item">
            <span className="info-label">Stability:</span>
            <span className="info-value">Stable</span>
          </div>
        </div>
        
        <div className="code-preview">
          <h4>Code Preview:</h4>
          <pre>{`
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
          `}</pre>
        </div>
      </div>
    </div>
  );
}

export default SortingVisualizer;