import React, { useState } from 'react';
import './TreeVisualizer.css';

function TreeVisualizer() {
  const [tree, setTree] = useState({
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: { value: 40, left: null, right: null }
    },
    right: {
      value: 70,
      left: { value: 60, left: null, right: null },
      right: { value: 80, left: null, right: null }
    }
  });
  
  const [operation, setOperation] = useState('insert');
  const [value, setValue] = useState('');
  const [traversalResult, setTraversalResult] = useState([]);

  const TreeNode = ({ node, level = 0 }) => {
    if (!node) return null;

    return (
      <div className="tree-node-container">
        <div className="tree-node">
          <span className="node-value">{node.value}</span>
        </div>
        {(node.left || node.right) && (
          <div className="tree-children">
            {node.left && (
              <div className="tree-child left">
                <div className="connector"></div>
                <TreeNode node={node.left} level={level + 1} />
              </div>
            )}
            {node.right && (
              <div className="tree-child right">
                <div className="connector"></div>
                <TreeNode node={node.right} level={level + 1} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleInsert = () => {
    if (!value) return;
    const newValue = parseInt(value);
    // Simple BST insertion simulation
    setTraversalResult([`Inserting ${newValue} into the tree...`]);
    setValue('');
  };

  const handleTraversal = (type) => {
    const results = {
      inorder: ['Inorder: 20, 30, 40, 50, 60, 70, 80'],
      preorder: ['Preorder: 50, 30, 20, 40, 70, 60, 80'],
      postorder: ['Postorder: 20, 40, 30, 60, 80, 70, 50']
    };
    setTraversalResult(results[type]);
  };

  return (
    <div className="tree-visualizer fade-in">
      <div className="visualizer-header">
        <h1>Binary Search Tree</h1>
        <p>Visualize tree operations and traversals</p>
      </div>

      <div className="control-panel glass">
        <div className="tree-controls">
          <div className="input-group">
            <label>Value:</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
            />
          </div>
          
          <div className="operation-buttons">
            <button className="btn primary-btn" onClick={handleInsert}>
              🌿 Insert Node
            </button>
            <button className="btn secondary-btn" onClick={() => handleTraversal('inorder')}>
              🔄 Inorder
            </button>
            <button className="btn secondary-btn" onClick={() => handleTraversal('preorder')}>
              📋 Preorder
            </button>
            <button className="btn secondary-btn" onClick={() => handleTraversal('postorder')}>
              📄 Postorder
            </button>
          </div>
        </div>
      </div>

      <div className="visualization-area">
        <div className="tree-container">
          <TreeNode node={tree} />
        </div>
      </div>

      {traversalResult.length > 0 && (
        <div className="result-panel glass">
          <h3>Traversal Result</h3>
          <div className="traversal-result">
            {traversalResult.map((step, index) => (
              <div key={index} className="traversal-step">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-panel glass">
        <div className="tree-info">
          <h3>Binary Search Tree Properties</h3>
          <div className="properties-grid">
            <div className="property">
              <span className="property-name">Left Child:</span>
              <span className="property-value">Always less than parent</span>
            </div>
            <div className="property">
              <span className="property-name">Right Child:</span>
              <span className="property-value">Always greater than parent</span>
            </div>
            <div className="property">
              <span className="property-name">Search Time:</span>
              <span className="property-value">O(log n) average</span>
            </div>
            <div className="property">
              <span className="property-name">Insertion Time:</span>
              <span className="property-value">O(log n) average</span>
            </div>
          </div>
        </div>

        <div className="traversal-explanations">
          <h4>Tree Traversals</h4>
          <div className="traversal-types">
            <div className="traversal-type">
              <h5>Inorder (Left, Root, Right)</h5>
              <p>Returns nodes in ascending order for BST</p>
            </div>
            <div className="traversal-type">
              <h5>Preorder (Root, Left, Right)</h5>
              <p>Useful for copying the tree structure</p>
            </div>
            <div className="traversal-type">
              <h5>Postorder (Left, Right, Root)</h5>
              <p>Useful for deleting the tree</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreeVisualizer;