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
    </div>
  );
}

export default StackQueueVisualizer;