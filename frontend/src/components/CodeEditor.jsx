import { useState } from 'react';
import { submissionAPI } from '../utils/challengeAPI';
import './CodeEditor.css';

const CodeEditor = ({ challenge, onClose }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [submission, setSubmission] = useState(null);

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code first');
      return;
    }

    setIsRunning(true);
    try {
      // Simulate code execution with test cases
      const results = challenge.testCases?.map((testCase, idx) => ({
        passed: Math.random() > 0.3, // 70% pass rate for demo
        message: `Test case ${idx + 1}${Math.random() > 0.3 ? ' passed' : ' failed'}`
      })) || [];

      setTestResults(results);
      const passedCount = results.filter(r => r.passed).length;
      setOutput(`Code executed!\n\nPassed: ${passedCount}/${results.length} test cases`);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code first');
      return;
    }

    setIsRunning(true);
    try {
      const response = await submissionAPI.submitSolution({
        challengeId: challenge._id,
        code,
        language: 'JavaScript'
      });

      if (response && response.submission) {
        setSubmission(response.submission);
        setTestResults(response.submission.testResults);
        
        if (response.submission.status === 'Accepted') {
          setOutput('🎉 Congratulations! Your solution was accepted!');
          setTimeout(() => {
            alert('Challenge completed! Your stats have been updated.');
            onClose();
          }, 1500);
        } else {
          setOutput(`Submission Status: ${response.submission.status}\n\nPassed: ${response.submission.testsPassed}/${response.submission.totalTests} test cases`);
        }
      }
    } catch (err) {
      setOutput(`Submission error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-editor-modal" onClick={onClose}>
      <div className="code-editor-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="editor-header">
          <h2>{challenge.title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="editor-content">
          {/* Problem Statement */}
          <div className="problem-panel">
            <div className="panel-header">
              <h3>Problem Statement</h3>
            </div>
            <div className="panel-body">
              <p><strong>Description:</strong> {challenge.description}</p>
              <p><strong>Problem:</strong> {challenge.problemStatement}</p>
              
              <div className="example-section">
                <h4>Example:</h4>
                <div className="example-box">
                  <p><strong>Input:</strong> {challenge.exampleInput}</p>
                  <p><strong>Output:</strong> {challenge.exampleOutput}</p>
                </div>
              </div>

              <div className="constraints-section">
                <h4>Constraints:</h4>
                <ul>
                  {challenge.constraints && challenge.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>

              <div className="complexity-section">
                <p><strong>Time Complexity:</strong> {challenge.timeComplexity}</p>
                <p><strong>Space Complexity:</strong> {challenge.spaceComplexity}</p>
              </div>

              {challenge.hints && challenge.hints.length > 0 && (
                <div className="hints-section">
                  <h4>Hints:</h4>
                  <ul>
                    {challenge.hints.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div className="editor-panel">
            <div className="panel-header">
              <h3>Code Editor</h3>
              <span className="language-badge">JavaScript</span>
            </div>
            <textarea
              className="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your solution here..."
              spellCheck="false"
            />
          </div>

          {/* Output Panel */}
          <div className="output-panel">
            <div className="panel-header">
              <h3>Output</h3>
            </div>
            <div className="output-content">
              {output && (
                <pre className="output-text">{output}</pre>
              )}
              {testResults.length > 0 && (
                <div className="test-results">
                  <h4>Test Results:</h4>
                  {testResults.map((result, idx) => (
                    <div key={idx} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
                      <span className="result-icon">{result.passed ? '✓' : '✗'}</span>
                      <span className="result-message">{result.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="editor-footer">
          <button 
            className="run-btn" 
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={isRunning}
          >
            {isRunning ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
