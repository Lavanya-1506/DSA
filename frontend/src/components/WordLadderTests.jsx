import React, { useState } from 'react';
import './WordLadderTests.css';

function WordLadderTests() {
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  // Test cases
  const testCases = [
    {
      id: 1,
      beginWord: "hit",
      endWord: "cog",
      wordList: ["hot", "dot", "dog", "lot", "log", "cog"],
      expected: 5,
      description: "Example case: hit -> hot -> dot -> dog -> cog",
      difficulty: "Medium",
      explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.'
    },
    {
      id: 2,
      beginWord: "hit",
      endWord: "cog",
      wordList: ["hot", "dot", "dog", "lot", "log"],
      expected: 0,
      description: "No path exists - cog not reachable",
      difficulty: "Medium",
      explanation: 'The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.'
    },
    {
      id: 3,
      beginWord: "a",
      endWord: "c",
      wordList: ["a", "b", "c"],
      expected: 2,
      description: "Simple path: a -> c (via b)",
      difficulty: "Easy",
      explanation: '"a" and "c" differ by one letter'
    },
    {
      id: 4,
      beginWord: "cat",
      endWord: "bat",
      wordList: ["bat"],
      expected: 2,
      description: "Direct transformation: cat -> bat",
      difficulty: "Easy",
      explanation: '"cat" differs from "bat" by one letter'
    },
    {
      id: 5,
      beginWord: "cold",
      endWord: "warm",
      wordList: ["cold", "cord", "card", "ward", "warm"],
      expected: 5,
      description: 'Path: cold -> cord -> card -> ward -> warm',
      difficulty: "Hard",
      explanation: 'Each step changes exactly one letter'
    },
    {
      id: 6,
      beginWord: "red",
      endWord: "tax",
      wordList: ["red", "ted", "tex", "tax"],
      expected: 4,
      description: "Multiple paths: red -> ted -> tex -> tax",
      difficulty: "Medium",
      explanation: 'Direct path exists with all intermediate words'
    },
    {
      id: 7,
      beginWord: "a",
      endWord: "b",
      wordList: [],
      expected: 0,
      description: "Empty word list",
      difficulty: "Easy",
      explanation: 'No words available for transformation'
    },
    {
      id: 8,
      beginWord: "leet",
      endWord: "code",
      wordList: ["leet", "code"],
      expected: 0,
      description: "Words differ by more than one letter",
      difficulty: "Easy",
      explanation: '"leet" and "code" differ in multiple positions'
    }
  ];

  // Word Ladder Algorithm Implementation
  const wordLadderSolution = (beginWord, endWord, wordList) => {
    const wordSet = new Set(wordList);
    
    if (!wordSet.has(endWord)) return 0;
    
    const queue = [[beginWord, 1]];
    
    while (queue.length) {
      const [word, level] = queue.shift();
      
      if (word === endWord) return level;
      
      for (let i = 0; i < word.length; i++) {
        for (let c = 97; c <= 122; c++) { // 'a' to 'z'
          const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
          
          if (wordSet.has(newWord)) {
            queue.push([newWord, level + 1]);
            wordSet.delete(newWord);
          }
        }
      }
    }
    
    return 0;
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    const results = {};
    
    for (const test of testCases) {
      const startTime = performance.now();
      const result = wordLadderSolution(test.beginWord, test.endWord, test.wordList);
      const endTime = performance.now();
      
      results[test.id] = {
        passed: result === test.expected,
        result,
        expected: test.expected,
        time: (endTime - startTime).toFixed(2)
      };
      
      // Simulate delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setTestResults(results);
    setIsRunning(false);
  };

  // Run single test
  const runTest = (testId) => {
    const test = testCases.find(t => t.id === testId);
    const startTime = performance.now();
    const result = wordLadderSolution(test.beginWord, test.endWord, test.wordList);
    const endTime = performance.now();
    
    setTestResults(prev => ({
      ...prev,
      [testId]: {
        passed: result === test.expected,
        result,
        expected: test.expected,
        time: (endTime - startTime).toFixed(2)
      }
    }));
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#f44336';
      default: return '#667eea';
    }
  };

  // Calculate statistics
  const stats = {
    total: testCases.length,
    passed: Object.values(testResults).filter(r => r.passed).length,
    failed: Object.values(testResults).filter(r => !r.passed).length,
    executed: Object.keys(testResults).length
  };

  return (
    <div className="word-ladder-tests">
      <div className="tests-header">
        <h1>🧪 Word Ladder Test Suite</h1>
        <p>Comprehensive test cases for Word Ladder algorithm</p>
      </div>

      <div className="tests-stats">
        <div className="stat-card">
          <h3>Total Tests</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card success">
          <h3>Passed</h3>
          <p className="stat-number">{stats.passed}</p>
        </div>
        <div className="stat-card error">
          <h3>Failed</h3>
          <p className="stat-number">{stats.failed}</p>
        </div>
        <div className="stat-card info">
          <h3>Executed</h3>
          <p className="stat-number">{stats.executed}</p>
        </div>
      </div>

      <div className="tests-controls">
        <button 
          className="btn btn-primary" 
          onClick={runAllTests}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Running Tests...' : '▶ Run All Tests'}
        </button>
      </div>

      <div className="tests-list">
        {testCases.map(test => (
          <div 
            key={test.id} 
            className={`test-card ${testResults[test.id]?.passed ? 'passed' : testResults[test.id] ? 'failed' : ''}`}
            onClick={() => setSelectedTest(selectedTest === test.id ? null : test.id)}
          >
            <div className="test-header">
              <div className="test-title">
                {testResults[test.id] && (
                  <span className="test-status">
                    {testResults[test.id].passed ? '✓' : '✗'}
                  </span>
                )}
                <span className="test-id">Test #{test.id}</span>
                <span className="test-description">{test.description}</span>
              </div>
              <div className="test-meta">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(test.difficulty) }}
                >
                  {test.difficulty}
                </span>
                {testResults[test.id] && (
                  <span className="test-time">{testResults[test.id].time}ms</span>
                )}
              </div>
            </div>

            {selectedTest === test.id && (
              <div className="test-details">
                <div className="detail-section">
                  <h4>Input:</h4>
                  <code>
                    beginWord: "{test.beginWord}"<br/>
                    endWord: "{test.endWord}"<br/>
                    wordList: {JSON.stringify(test.wordList)}
                  </code>
                </div>

                <div className="detail-section">
                  <h4>Expected Output:</h4>
                  <code>{test.expected}</code>
                </div>

                {testResults[test.id] && (
                  <div className="detail-section">
                    <h4>Actual Output:</h4>
                    <code className={testResults[test.id].passed ? 'correct' : 'incorrect'}>
                      {testResults[test.id].result}
                    </code>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Explanation:</h4>
                  <p>{test.explanation}</p>
                </div>

                <button 
                  className="btn btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    runTest(test.id);
                  }}
                >
                  ▶ Run This Test
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WordLadderTests;
