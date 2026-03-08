import React, { useState } from 'react';
import './TreeVisualizer.css';

function TreeVisualizer() {
  // load tree from localStorage if available, otherwise default
  const defaultTree = {
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
  };
  const [tree, setTree] = useState(() => {
    try {
      const stored = localStorage.getItem('bst-tree');
      return stored ? JSON.parse(stored) : defaultTree;
    } catch {
      return defaultTree;
    }
  });

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

  const insertIntoNode = (node, newValue) => {
    if (!node) {
      return { value: newValue, left: null, right: null };
    }
    if (newValue < node.value) {
      return { ...node, left: insertIntoNode(node.left, newValue) };
    } else if (newValue > node.value) {
      return { ...node, right: insertIntoNode(node.right, newValue) };
    }
    // if equal, just return node (no duplicates)
    return node;
  };

  const deleteFromNode = (node, target) => {
    if (!node) return null;
    if (target < node.value) {
      return { ...node, left: deleteFromNode(node.left, target) };
    } else if (target > node.value) {
      return { ...node, right: deleteFromNode(node.right, target) };
    } else {
      // node to delete
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      // two children: find successor (min in right subtree)
      let succ = node.right;
      while (succ.left) succ = succ.left;
      return { ...node, value: succ.value, right: deleteFromNode(node.right, succ.value) };
    }
  };

  const traverseInOrder = (node, arr = []) => {
    if (!node) return arr;
    traverseInOrder(node.left, arr);
    arr.push(node.value);
    traverseInOrder(node.right, arr);
    return arr;
  };

  const traversePreOrder = (node, arr = []) => {
    if (!node) return arr;
    arr.push(node.value);
    traversePreOrder(node.left, arr);
    traversePreOrder(node.right, arr);
    return arr;
  };

  const traversePostOrder = (node, arr = []) => {
    if (!node) return arr;
    traversePostOrder(node.left, arr);
    traversePostOrder(node.right, arr);
    arr.push(node.value);
    return arr;
  };

  // persist tree whenever it changes
  const updateTree = (updater) => {
    setTree((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('bst-tree', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleInsert = () => {
    if (!value) return;
    const newValue = parseInt(value, 10);
    if (isNaN(newValue)) return;

    updateTree((prev) => insertIntoNode(prev, newValue));
    setTraversalResult([`Inserted ${newValue} into the tree.`]);
    setValue('');
  };

  const handleDelete = () => {
    if (!value) return;
    const target = parseInt(value, 10);
    if (isNaN(target)) return;

    updateTree((prev) => deleteFromNode(prev, target));
    setTraversalResult([`Deleted ${target} from the tree (if it existed).`]);
    setValue('');
  };

  const handleTraversal = (type) => {
    const steps = [];
    const result = [];

    const helper = (node) => {
      if (!node) return;
      if (type === 'inorder') {
        helper(node.left);
        steps.push(`Visit ${node.value}`);
        result.push(node.value);
        helper(node.right);
      } else if (type === 'preorder') {
        steps.push(`Visit ${node.value}`);
        result.push(node.value);
        helper(node.left);
        helper(node.right);
      } else if (type === 'postorder') {
        helper(node.left);
        helper(node.right);
        steps.push(`Visit ${node.value}`);
        result.push(node.value);
      }
    };

    helper(tree);
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    steps.push(`${label} result: ${result.join(', ')}`);
    setTraversalResult(steps);
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
            <button className="btn danger-btn" onClick={handleDelete}>
              ❌ Delete Node
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
      </div>

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