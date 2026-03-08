import React, { useState } from 'react';
import './SearchingVisualizer.css';

function SearchingVisualizer() {
  const [array, setArray] = useState([10, 23, 35, 42, 56, 68, 74, 81, 95, 100]);
  const [target, setTarget] = useState(56);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('binary');
  const [searchSteps, setSearchSteps] = useState([]);

  const algorithms = [
    { id: 'linear', name: 'Linear Search', complexity: 'O(n)' },
    { id: 'binary', name: 'Binary Search', complexity: 'O(log n)' }
  ];
  const algorithmDetails = {
    linear: {
      title: 'Linear Search Algorithm',
      code: `linearSearch(arr, target):
  for i from 0 to length(arr) - 1:
    if arr[i] == target:
      return i
  return -1`
    },
    binary: {
      title: 'Binary Search Algorithm',
      code: `binarySearch(arr, target):
  left = 0
  right = length(arr) - 1
  while left <= right:
    mid = floor((left + right) / 2)
    if arr[mid] == target:
      return mid
    else if arr[mid] < target:
      left = mid + 1
    else:
      right = mid - 1
  return -1`
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setResult(null);
    setSearchSteps([]);
    
    if (selectedAlgorithm === 'linear') {
      await linearSearch();
    } else {
      await binarySearch();
    }
    
    setIsSearching(false);
  };

  const linearSearch = async () => {
    const steps = [];

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      steps.push(`Step ${steps.length + 1}: Check index ${i} (value ${array[i]}).`);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (array[i] === target) {
        steps.push(`Step ${steps.length + 1}: Match found. ${array[i]} equals target ${target}.`);
        setSearchSteps(steps);
        setResult({ found: true, index: i });
        return;
      }
    }

    steps.push(`Step ${steps.length + 1}: Target ${target} was not found after checking all elements.`);
    setSearchSteps(steps);
    setResult({ found: false, index: -1 });
  };

  const binarySearch = async () => {
    let left = 0;
    let right = array.length - 1;
    const steps = [];
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setCurrentIndex(mid);
      steps.push(
        `Step ${steps.length + 1}: Search range [${left}, ${right}], mid = ${mid}, value = ${array[mid]}.`
      );
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (array[mid] === target) {
        steps.push(`Step ${steps.length + 1}: Match found at index ${mid}.`);
        setSearchSteps(steps);
        setResult({ found: true, index: mid });
        return;
      } else if (array[mid] < target) {
        steps.push(
          `Step ${steps.length + 1}: ${array[mid]} < ${target}, move to right half (${mid + 1} to ${right}).`
        );
        left = mid + 1;
      } else {
        steps.push(
          `Step ${steps.length + 1}: ${array[mid]} > ${target}, move to left half (${left} to ${mid - 1}).`
        );
        right = mid - 1;
      }
    }
    
    steps.push(`Step ${steps.length + 1}: Target ${target} was not found after the search range became empty.`);
    setSearchSteps(steps);
    setResult({ found: false, index: -1 });
  };

  const resetSearch = () => {
    setCurrentIndex(-1);
    setResult(null);
    setSearchSteps([]);
  };

  const generateNewArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    newArray.sort((a, b) => a - b);
    setArray(newArray);
    resetSearch();
  };

  return (
    <div className="searching-visualizer fade-in">
      <div className="visualizer-header">
        <h1>Searching Algorithms</h1>
        <p>Visualize how different searching algorithms find elements in arrays</p>
      </div>

      <div className="control-panel glass">
        <div className="search-controls">
          <div className="input-group">
            <label>Target Value:</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
              disabled={isSearching}
            />
          </div>
          
          <div className="input-group">
            <label>Algorithm:</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              disabled={isSearching}
            >
              {algorithms.map(algo => (
                <option key={algo.id} value={algo.id}>
                  {algo.name} ({algo.complexity})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="control-buttons">
          <button
            className="btn primary-btn"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? '🔍 Searching...' : '🚀 Start Search'}
          </button>
          <button
            className="btn secondary-btn"
            onClick={generateNewArray}
            disabled={isSearching}
          >
            🔄 New Array
          </button>
          <button
            className="btn secondary-btn"
            onClick={resetSearch}
            disabled={isSearching}
          >
            🎯 Reset
          </button>
        </div>
      </div>

      <div className="visualization-area">
        <div className="search-visual-panel glass">
          <div className="array-container">
            {array.map((value, index) => (
              <div
                key={index}
                className={`array-element ${
                  index === currentIndex ? 'searching' : ''
                } ${
                  result?.found && index === result.index ? 'found' : ''
                } ${
                  result?.found === false && index === currentIndex ? 'not-found' : ''
                }`}
              >
                <div className="element-value">{value}</div>
                <div className="element-index">{index}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="search-steps-panel glass">
          <h3>Search Steps</h3>
          <div className="search-steps-list">
            {searchSteps.length > 0 ? (
              searchSteps.map((step, index) => (
                <div key={index} className="search-step-item">
                  {step}
                </div>
              ))
            ) : (
              <div className="search-steps-empty">
                Run a search to see step-by-step history here.
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className={`result-panel glass ${result.found ? 'success' : 'error'}`}>
          <h3>
            {result.found 
              ? `🎉 Target ${target} found at index ${result.index}!` 
              : `❌ Target ${target} not found in the array`
            }
          </h3>
          <p>
            {result.found
              ? `The algorithm found the target value after checking ${result.index + 1} elements.`
              : 'The algorithm searched through all elements but could not find the target value.'
            }
          </p>
        </div>
      )}

      <div className="algorithm-panel glass">
        <h3>{algorithmDetails[selectedAlgorithm].title}</h3>
        <pre className="algorithm-code">
          <code>{algorithmDetails[selectedAlgorithm].code}</code>
        </pre>
      </div>

      <div className="info-panel glass">
        <div className="algorithm-explanation">
          <h3>How {selectedAlgorithm === 'linear' ? 'Linear Search' : 'Binary Search'} Works</h3>
          <p>
            {selectedAlgorithm === 'linear' 
              ? 'Linear search checks each element in the array sequentially until the target is found or the end is reached.'
              : 'Binary search works on sorted arrays by repeatedly dividing the search interval in half.'
            }
          </p>
        </div>

        <div className="complexity-comparison">
          <h4>Time Complexity Comparison</h4>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="complexity-type">Best Case</span>
              <span className="complexity-value">
                {selectedAlgorithm === 'linear' ? 'O(1)' : 'O(1)'}
              </span>
            </div>
            <div className="complexity-item">
              <span className="complexity-type">Average Case</span>
              <span className="complexity-value">
                {selectedAlgorithm === 'linear' ? 'O(n)' : 'O(log n)'}
              </span>
            </div>
            <div className="complexity-item">
              <span className="complexity-type">Worst Case</span>
              <span className="complexity-value">
                {selectedAlgorithm === 'linear' ? 'O(n)' : 'O(log n)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchingVisualizer;
