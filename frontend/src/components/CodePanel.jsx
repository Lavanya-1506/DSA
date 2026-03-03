import React, { useState } from 'react';
import './CodePanel.css';

const LANGUAGE_OPTIONS = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C', value: 'c' },
];

const formatValue = (value) => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
};

function CodePanel({ code, setCode, challengeId, testCases }) {
  const [output, setOutput] = useState('Code output will appear here...');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [programOutput, setProgramOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [language, setLanguage] = useState('javascript');

  const buildProgramOutput = (results) => {
    if (!results || results.length === 0) {
      return 'No program output captured. Add test cases to see output.';
    }

    const blocks = [];
    results.forEach((result, index) => {
      const testNumber = result.testCase ?? index + 1;
      const lines = [`[Test ${testNumber}]`];

      if (result.logs && result.logs.length > 0) {
        lines.push(...result.logs);
      }

      if (result.actualOutput !== undefined && result.actualOutput !== null) {
        lines.push(`Return: ${formatValue(result.actualOutput)}`);
      }

      if (result.error) {
        lines.push(`Runtime Error: ${result.error}`);
      }

      blocks.push(lines.join('\n'));
    });

    return blocks.join('\n\n');
  };

  const runCode = async () => {
    if (!challengeId && !testCases) {
      setOutput('No challenge selected.');
      setTerminalOutput('');
      setProgramOutput('');
      return;
    }

    setRunning(true);
    setOutput('Running...');
    setTerminalOutput('$ Starting execution...');
    setProgramOutput('');

    try {
      const body = testCases ? { testCases, code, language } : { challengeId, code, language };
      const resp = await fetch('/api/submissions/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await resp.json();
      if (!data.success) {
        setOutput(`Error: ${data.message || 'Execution failed'}`);
        setTerminalOutput(`$ Execution failed\nError: ${data.message || 'Execution failed'}`);
        setProgramOutput('');
        setTestResults(null);
      } else {
        const passed = data.passed || 0;
        const total = data.total || 0;
        const results = data.testResults || [];
        setTestResults(results);
        setOutput(`${passed} / ${total} tests passed`);
        setProgramOutput(buildProgramOutput(results));

        const lines = [`$ Running ${language.toUpperCase()} test suite...`, `Passed: ${passed}/${total}`, ''];
        results.forEach((tr, index) => {
          lines.push(`[Test ${tr.testCase ?? index + 1}] ${tr.passed ? 'PASS' : 'FAIL'}`);
          lines.push(`Input: ${formatValue(tr.input)}`);
          lines.push(`Expected: ${formatValue(tr.expectedOutput)}`);
          lines.push(`Got: ${formatValue(tr.actualOutput)}`);
          if (!tr.passed && !tr.error) {
            lines.push('Error: Wrong answer (test case output mismatch)');
          }
          if (tr.error) {
            lines.push(`Error: ${tr.error}`);
          }
          if (tr.logs && tr.logs.length > 0) {
            lines.push('Logs:');
            tr.logs.forEach((line) => lines.push(`  ${line}`));
          }
          lines.push('');
        });
        setTerminalOutput(lines.join('\n'));
      }
    } catch (err) {
      setOutput(`Network error: ${err.message}`);
      setTerminalOutput(`$ Network error\nError: ${err.message}`);
      setProgramOutput('');
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => {
    setCode('');
    setOutput('Code output will appear here...');
    setTerminalOutput('');
    setProgramOutput('');
    setTestResults(null);
  };

  return (
    <div className="code-panel glass fade-in">
      <div className="panel-header">
        <h3>Code Editor</h3>
        <div className="panel-actions">
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={running}
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="btn run-btn" onClick={runCode} disabled={running}>
            Run
          </button>
          <button className="btn reset-btn" onClick={resetCode}>
            Reset
          </button>
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
          <pre>{output}</pre>
        </div>

        {programOutput && (
          <div className="output-console program-console">
            <h4>Program Output</h4>
            <pre>{programOutput}</pre>
          </div>
        )}

        {terminalOutput && (
          <div className="output-console terminal-console">
            <pre>{terminalOutput}</pre>
          </div>
        )}

        {testResults && (
          <div className="test-results">
            <h4>Test Results</h4>
            <ul>
              {testResults.map((tr, idx) => (
                <li key={tr.testCase || idx} className={tr.passed ? 'passed' : 'failed'}>
                  <strong>Test {tr.testCase || idx + 1}:</strong> {tr.passed ? 'PASS' : 'FAIL'}
                  <div>Input: {formatValue(tr.input)}</div>
                  <div>Expected: {formatValue(tr.expectedOutput)}</div>
                  <div>Got: {formatValue(tr.actualOutput)}</div>
                  {!tr.passed && !tr.error && (
                    <div className="error">Error: Wrong answer (test case output mismatch)</div>
                  )}
                  {tr.error && <div className="error">Error: {tr.error}</div>}
                  {tr.logs && tr.logs.length > 0 && (
                    <div>
                      Logs:
                      <pre>{tr.logs.join('\n')}</pre>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodePanel;
