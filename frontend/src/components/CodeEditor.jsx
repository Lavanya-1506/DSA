import { useState } from 'react';
import { submissionAPI } from '../utils/challengeAPI';
import './CodeEditor.css';

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

const buildTerminalOutput = (results, passedCount, totalCount, language) => {
  const lines = [
    `$ Running ${language.toUpperCase()} test suite...`,
    `Passed: ${passedCount}/${totalCount}`,
    '',
  ];

  results.forEach((result, index) => {
    const testNumber = result.testCase ?? index + 1;
    lines.push(`[Test ${testNumber}] ${result.passed ? 'PASS' : 'FAIL'}`);
    lines.push(`Input: ${formatValue(result.input)}`);
    lines.push(`Expected: ${formatValue(result.expectedOutput)}`);
    lines.push(`Got: ${formatValue(result.actualOutput)}`);

    if (!result.passed && !result.error) {
      lines.push('Error: Wrong answer (output did not match expected test case)');
    }
    if (result.error) {
      lines.push(`Error: ${result.error}`);
    }
    if (result.logs && result.logs.length > 0) {
      lines.push('Logs:');
      result.logs.forEach((line) => lines.push(`  ${line}`));
    }
    lines.push('');
  });

  return lines.join('\n');
};

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

const CodeEditor = ({ challenge, onClose }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [programOutput, setProgramOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const sampleOutput = challenge?.exampleOutput ? String(challenge.exampleOutput) : 'N/A';

  const isNoTestCaseError = (message) =>
    typeof message === 'string' &&
    (message.toLowerCase().includes('no test cases configured') ||
      message.toLowerCase().includes('no runnable test data'));

  const buildRunResult = (results, passedCount, totalCount) => {
    const firstFailed = results.find((result) => !result.passed) || null;
    const hasRuntimeError = results.some((result) => Boolean(result.error));

    if (totalCount === 0) {
      return {
        status: 'invalid',
        passedCount,
        totalCount,
        title: 'No Test Cases',
        message: 'No test cases are configured for this challenge.',
        firstFailed,
      };
    }

    if (passedCount === totalCount) {
      return {
        status: 'accepted',
        passedCount,
        totalCount,
        title: 'Accepted',
        message: `All test cases passed (${passedCount}/${totalCount})`,
        firstFailed,
      };
    }

    if (hasRuntimeError) {
      return {
        status: 'runtime',
        passedCount,
        totalCount,
        title: 'Runtime Error',
        message: `Passed ${passedCount}/${totalCount} test cases before error.`,
        firstFailed,
      };
    }

    return {
      status: 'wrong',
      passedCount,
      totalCount,
      title: 'Wrong Answer',
      message: `Passed ${passedCount}/${totalCount} test cases.`,
      firstFailed,
    };
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput('Please write some code first');
      setTerminalOutput('');
      setProgramOutput('');
      setTestResults([]);
      return;
    }

    setIsRunning(true);
    setSubmission(null);
    setOutput('Running code...');
    setTerminalOutput('$ Starting execution...');
    setProgramOutput('');
    setRunResult(null);

    try {
      const response = await submissionAPI.runCode({
        challengeId: challenge._id,
        code,
        language,
        testCases: challenge._id ? undefined : challenge.testCases,
      });

      const results = response?.testResults || [];
      const passedCount = response?.passed ?? results.filter((result) => result.passed).length;
      const totalCount = response?.total ?? results.length;

      if (totalCount === 0) {
        setOutput(`Sample Output: ${sampleOutput}`);
        setProgramOutput(sampleOutput);
        setTerminalOutput('');
        setTestResults([]);
        setRunResult(null);
        return;
      }

      setTestResults(results);
      setOutput(`Run complete: ${passedCount}/${totalCount} test cases passed`);
      setTerminalOutput(buildTerminalOutput(results, passedCount, totalCount, language));
      setProgramOutput(buildProgramOutput(results));
      setRunResult(buildRunResult(results, passedCount, totalCount));
    } catch (err) {
      if (isNoTestCaseError(err.message)) {
        setOutput(`Sample Output: ${sampleOutput}`);
        setProgramOutput(sampleOutput);
        setTerminalOutput('');
        setTestResults([]);
        setRunResult(null);
        return;
      }
      setOutput(`Run error: ${err.message}`);
      setTerminalOutput(`$ Execution failed\nError: ${err.message}`);
      setProgramOutput('');
      setTestResults([]);
      setRunResult({
        status: 'error',
        passedCount: 0,
        totalCount: 0,
        title: 'Execution Failed',
        message: err.message,
        firstFailed: null,
      });
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
      // Pre-check: code must execute without runtime/syntax errors before submit.
      const precheck = await submissionAPI.runCode({
        challengeId: challenge._id,
        code,
        language,
        testCases: challenge._id ? undefined : challenge.testCases,
      });

      const preResults = precheck?.testResults || [];
      const prePassed = precheck?.passed ?? preResults.filter((result) => result.passed).length;
      const preTotal = precheck?.total ?? preResults.length;
      const firstError = preResults.find((result) => Boolean(result.error));

      if (preTotal === 0) {
        setOutput('Submission blocked: no test cases configured for this challenge.');
        setTerminalOutput('$ Submission blocked\nError: No test cases configured for this challenge.');
        setProgramOutput('');
        setRunResult({
          status: 'invalid',
          passedCount: 0,
          totalCount: 0,
          title: 'Submission Blocked',
          message: 'No test cases are configured for this challenge.',
          firstFailed: null,
        });
        return;
      }

      if (firstError) {
        setTestResults(preResults);
        setOutput('Submission blocked: fix code errors shown below, then submit again.');
        setTerminalOutput(buildTerminalOutput(preResults, prePassed, preTotal, language));
        setProgramOutput(buildProgramOutput(preResults));
        setRunResult({
          status: 'runtime',
          passedCount: prePassed,
          totalCount: preTotal,
          title: 'Code Error',
          message: 'Your code has an execution error. Fix it before submission.',
          firstFailed: firstError,
        });
        return;
      }

      const response = await submissionAPI.submitSolution(challenge._id, code, language);

      if (response && response.submission) {
        setSubmission(response.submission);
        const results = response.submission.testResults || [];
        setTestResults(results);
        setTerminalOutput(
          buildTerminalOutput(
            results,
            response.submission.testsPassed || 0,
            response.submission.totalTests || 0,
            language
          )
        );
        setProgramOutput(buildProgramOutput(results));
        setRunResult(
          buildRunResult(
            results,
            response.submission.testsPassed || 0,
            response.submission.totalTests || 0
          )
        );

        if (response.submission.status === 'Accepted') {
          setOutput('Submission successful. Solution accepted.');
          setTimeout(() => {
            alert('Challenge completed! Your stats have been updated.');
            onClose();
          }, 1500);
        } else {
          setOutput('Submission successful.');
        }
      }
    } catch (err) {
      setOutput(`Submission error: ${err.message}`);
      setTerminalOutput(`$ Submission failed\nError: ${err.message}`);
      setProgramOutput('');
      setRunResult({
        status: 'error',
        passedCount: 0,
        totalCount: 0,
        title: 'Submission Failed',
        message: err.message,
        firstFailed: null,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-editor-modal" onClick={onClose}>
      <div className="code-editor-container" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <h2>{challenge.title}</h2>
          <button className="close-btn" onClick={onClose}>
            x
          </button>
        </div>

        <div className="editor-content">
          <div className="problem-panel">
            <div className="panel-header">
              <h3>Problem Statement</h3>
            </div>
            <div className="panel-body">
              <p>
                <strong>Description:</strong> {challenge.description}
              </p>
              <p>
                <strong>Problem:</strong> {challenge.problemStatement}
              </p>

              <div className="example-section">
                <h4>Example:</h4>
                <div className="example-box">
                  <p>
                    <strong>Input:</strong> {challenge.exampleInput}
                  </p>
                  <p>
                    <strong>Output:</strong> {challenge.exampleOutput}
                  </p>
                </div>
              </div>

              <div className="constraints-section">
                <h4>Constraints:</h4>
                <ul>
                  {challenge.constraints &&
                    challenge.constraints.map((constraint, idx) => <li key={idx}>{constraint}</li>)}
                </ul>
              </div>

              <div className="complexity-section">
                <p>
                  <strong>Time Complexity:</strong> {challenge.timeComplexity}
                </p>
                <p>
                  <strong>Space Complexity:</strong> {challenge.spaceComplexity}
                </p>
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

          <div className="editor-panel">
            <div className="panel-header">
              <h3>Code Editor</h3>
              <select
                className="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isRunning}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your solution here..."
              spellCheck="false"
            />
          </div>

          <div className="output-panel">
            <div className="panel-header">
              <h3>Output</h3>
            </div>
            <div className="output-content">
              {runResult && (
                <div className={`verdict-card ${runResult.status}`}>
                  <div className="verdict-title">{runResult.title}</div>
                  <div className="verdict-message">{runResult.message}</div>
                  {runResult.firstFailed && (
                    <div className="verdict-detail">
                      <div>
                        <strong>Failed Test:</strong> {runResult.firstFailed.testCase}
                      </div>
                      <div>
                        <strong>Expected:</strong> {formatValue(runResult.firstFailed.expectedOutput)}
                      </div>
                      <div>
                        <strong>Got:</strong> {formatValue(runResult.firstFailed.actualOutput)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {output && <pre className="output-text">{output}</pre>}
              {programOutput && (
                <div className="program-output-block">
                  <h4>Program Output:</h4>
                  <pre className="program-output-text">{programOutput}</pre>
                </div>
              )}
              {terminalOutput && <pre className="terminal-output">{terminalOutput}</pre>}

              {testResults.length > 0 && (
                <div className="test-results">
                  <h4>Test Results:</h4>
                  {testResults.map((result, idx) => (
                    <div key={idx} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
                      <span className="result-icon">{result.passed ? 'PASS' : 'FAIL'}</span>
                      <div className="result-message">
                        <div className="result-title">Test case {result.testCase ?? idx + 1}</div>
                        {result.input !== undefined && (
                          <div className="result-line">
                            <strong>Input:</strong> {formatValue(result.input)}
                          </div>
                        )}
                        {result.expectedOutput !== undefined && (
                          <div className="result-line">
                            <strong>Expected:</strong> {formatValue(result.expectedOutput)}
                          </div>
                        )}
                        {result.actualOutput !== undefined && (
                          <div className="result-line">
                            <strong>Actual:</strong> {formatValue(result.actualOutput)}
                          </div>
                        )}
                        {!result.passed && !result.error && (
                          <div className="result-line result-error">
                            <strong>Error:</strong> Wrong answer (test case output mismatch)
                          </div>
                        )}
                        {result.error && (
                          <div className="result-line result-error">
                            <strong>Error:</strong> {String(result.error)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="editor-footer">
          <button className="run-btn" onClick={handleRunCode} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button className="submit-btn" onClick={handleSubmit} disabled={isRunning}>
            {isRunning ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
