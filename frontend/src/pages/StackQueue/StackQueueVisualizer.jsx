import React, { useState } from 'react';
import './StackQueueVisualizer.css';

function StackQueueVisualizer() {
  const [structure, setStructure] = useState('stack');
  const [stack, setStack] = useState([10, 20, 30, 40]);
  const [queue, setQueue] = useState([10, 20, 30, 40]);
  const [inputValue, setInputValue] = useState('');
  const [operationHistory, setOperationHistory] = useState([]);

  const pushToStack = () => {
    if (!inputValue) return;
    const newValue = parseInt(inputValue);
    const newStack = [...stack, newValue];
    setStack(newStack);
    setOperationHistory(prev => [...prev, `Pushed ${newValue} to stack`]);
    setInputValue('');
  };

  const popFromStack = () => {
    if (stack.length === 0) return;
    const poppedValue = stack[stack.length - 1];
    const newStack = stack.slice(0, -1);
    setStack(newStack);
    setOperationHistory(prev => [...prev, `Popped ${poppedValue} from stack`]);
  };

  const enqueue = () => {
    if (!inputValue) return;
    const newValue = parseInt(inputValue);
    const newQueue = [...queue, newValue];
    setQueue(newQueue);
    setOperationHistory(prev => [...prev, `Enqueued ${newValue} to queue`]);
    setInputValue('');
  };

  const dequeue = () => {
    if (queue.length === 0) return;
    const dequeuedValue = queue[0];
    const newQueue = queue.slice(1);
    setQueue(newQueue);
    setOperationHistory(prev => [...prev, `Dequeued ${dequeuedValue} from queue`]);
  };

  const clearStructure = () => {
    if (structure === 'stack') {
      setStack([]);
    } else {
      setQueue([]);
    }
    setOperationHistory(prev => [...prev, 'Cleared structure']);
  };

  const currentData = structure === 'stack' ? stack : queue;

  return (
    <div className="stack-queue-visualizer fade-in">
      <div className="visualizer-header">
        <h1>Stack & Queue Visualizer</h1>
        <p>Understand LIFO (Stack) and FIFO (Queue) principles</p>
      </div>

      <div className="control-panel glass">
        <div className="structure-selector">
          <button
            className={`structure-btn ${structure === 'stack' ? 'active' : ''}`}
            onClick={() => setStructure('stack')}
          >
            📚 Stack (LIFO)
          </button>
          <button
            className={`structure-btn ${structure === 'queue' ? 'active' : ''}`}
            onClick={() => setStructure('queue')}
          >
            🎯 Queue (FIFO)
          </button>
        </div>

        <div className="operation-controls">
          <div className="input-group">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
            />
            {structure === 'stack' ? (
              <>
                <button className="btn primary-btn" onClick={pushToStack}>Push</button>
                <button className="btn secondary-btn" onClick={popFromStack} disabled={stack.length === 0}>Pop</button>
              </>
            ) : (
              <>
                <button className="btn primary-btn" onClick={enqueue}>Enqueue</button>
                <button className="btn secondary-btn" onClick={dequeue} disabled={queue.length === 0}>Dequeue</button>
              </>
            )}
            <button className="btn secondary-btn" onClick={clearStructure}>Clear</button>
          </div>
        </div>
      </div>

      <div className="visualization-area">
        <div className={`structure-visual glass ${structure}`}>
          <h2>{structure === 'stack' ? 'Stack (LIFO)' : 'Queue (FIFO)'}</h2>
          <div className="items-visual">
            {currentData.length === 0 ? (
              <div className="empty-msg">{structure === 'stack' ? 'Stack is empty' : 'Queue is empty'}</div>
            ) : (
              currentData.map((item, idx) => (
                <div key={idx} className="item">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="history-panel glass">
          <h3>Operation History</h3>
          <ul>
            {operationHistory.slice(-8).reverse().map((op, idx) => (
              <li key={idx}>{op}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="info-section">
        {structure === 'stack' ? (
          <div className="info-panel glass">
            <h3>📚 Stack Information</h3>
            <div className="info-grid">
              <div className="info-card">
                <h4>Definition</h4>
                <p>A Linear Data Structure that follows the LIFO (Last In First Out) principle. The last element added is the first one to be removed.</p>
              </div>
              <div className="info-card">
                <h4>Push Operation</h4>
                <div className="complexity-box">
                  <span className="complexity-label">Time:</span>
                  <span className="complexity-value">O(1)</span>
                </div>
                <p className="complexity-desc">Constant time insertion at the top</p>
              </div>
              <div className="info-card">
                <h4>Pop Operation</h4>
                <div className="complexity-box">
                  <span className="complexity-label">Time:</span>
                  <span className="complexity-value">O(1)</span>
                </div>
                <p className="complexity-desc">Constant time removal from the top</p>
              </div>
              <div className="info-card">
                <h4>Space Complexity</h4>
                <div className="complexity-box">
                  <span className="complexity-label">Space:</span>
                  <span className="complexity-value">O(n)</span>
                </div>
                <p className="complexity-desc">Linear space for n elements</p>
              </div>
              <div className="info-card full-width">
                <h4>Common Use Cases</h4>
                <ul className="use-cases">
                  <li>Function call stack (recursion)</li>
                  <li>Undo/Redo functionality</li>
                  <li>Browser history (back button)</li>
                  <li>Expression evaluation</li>
                  <li>DFS (Depth-First Search)</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="info-panel glass">
            <h3>🎯 Queue Information</h3>
            <div className="info-grid">
              <div className="info-card">
                <h4>Definition</h4>
                <p>A Linear Data Structure that follows the FIFO (First In First Out) principle. The first element added is the first one to be removed.</p>
              </div>
              <div className="info-card">
                <h4>Enqueue Operation</h4>
                <div className="complexity-box">
                  <span className="complexity-label">Time:</span>
                  <span className="complexity-value">O(1)</span>
                </div>
                <p className="complexity-desc">Constant time insertion at rear</p>
              </div>
              <div className="info-card">
                <h4>Dequeue Operation</h4>
                <div className="complexity-box">
                  <span className="complexity-label">Time:</span>
                  <span className="complexity-value">O(1)</span>
                </div>
                <p className="complexity-desc">Constant time removal from front</p>
              </div>
              <div className="info-card">
                <h4>Space Complexity</h4>
                <div className="complexity-box">
                  <span className="complexity-label">Space:</span>
                  <span className="complexity-value">O(n)</span>
                </div>
                <p className="complexity-desc">Linear space for n elements</p>
              </div>
              <div className="info-card full-width">
                <h4>Common Use Cases</h4>
                <ul className="use-cases">
                  <li>Task scheduling (CPU scheduling)</li>
                  <li>Breadth-First Search (BFS)</li>
                  <li>Print queue management</li>
                  <li>Message queues (async processing)</li>
                  <li>Customer service lines</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="algorithm-panel glass">
          <h3>{structure === 'stack' ? 'Stack Algorithms' : 'Queue Algorithms'}</h3>
          <div className="algorithm-grid">
            {structure === 'stack' ? (
              <>
                <div className="algorithm-card">
                  <h4>Push</h4>
                  <pre className="algorithm-code">
                    <code>{`PUSH(stack, x):
  stack[top + 1] = x
  top = top + 1`}</code>
                  </pre>
                </div>
                <div className="algorithm-card">
                  <h4>Pop</h4>
                  <pre className="algorithm-code">
                    <code>{`POP(stack):
  if top == -1:
    return "Underflow"
  x = stack[top]
  top = top - 1
  return x`}</code>
                  </pre>
                </div>
              </>
            ) : (
              <>
                <div className="algorithm-card">
                  <h4>Enqueue</h4>
                  <pre className="algorithm-code">
                    <code>{`ENQUEUE(queue, x):
  if rear == n - 1:
    return "Overflow"
  rear = rear + 1
  queue[rear] = x`}</code>
                  </pre>
                </div>
                <div className="algorithm-card">
                  <h4>Dequeue</h4>
                  <pre className="algorithm-code">
                    <code>{`DEQUEUE(queue):
  if front > rear:
    return "Underflow"
  x = queue[front]
  front = front + 1
  return x`}</code>
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StackQueueVisualizer;
