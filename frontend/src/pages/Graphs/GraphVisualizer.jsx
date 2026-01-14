import React, { useState } from 'react';
import './GraphVisualizer.css';

function GraphVisualizer() {
  const [graph, setGraph] = useState({
    nodes: [
      { id: 'A', x: 100, y: 100 },
      { id: 'B', x: 300, y: 100 },
      { id: 'C', x: 200, y: 250 },
      { id: 'D', x: 400, y: 200 },
      { id: 'E', x: 100, y: 350 }
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'E', weight: 10 },
      { from: 'D', to: 'E', weight: 2 }
    ]
  });
  
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bfs');
  const [startNode, setStartNode] = useState('A');
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [traversalResult, setTraversalResult] = useState([]);

  const algorithms = [
    { id: 'bfs', name: 'Breadth-First Search', complexity: 'O(V + E)' },
    { id: 'dfs', name: 'Depth-First Search', complexity: 'O(V + E)' }
  ];

  const handleAlgorithmRun = async () => {
    setIsAnimating(true);
    setVisitedNodes([]);
    setTraversalResult([]);

    if (selectedAlgorithm === 'bfs') {
      await runBFS();
    } else {
      await runDFS();
    }
    
    setIsAnimating(false);
  };

  const runBFS = async () => {
    const visited = new Set();
    const queue = [startNode];
    const result = [];
    
    visited.add(startNode);
    result.push(`Starting BFS from node ${startNode}`);

    while (queue.length > 0) {
      const current = queue.shift();
      setVisitedNodes(Array.from(visited));
      setTraversalResult([...result]);
      
      result.push(`Visiting node ${current}`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const neighbors = graph.edges
        .filter(edge => edge.from === current)
        .map(edge => edge.to)
        .concat(
          graph.edges
            .filter(edge => edge.to === current)
            .map(edge => edge.from)
        );

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          result.push(`Discovered node ${neighbor} from ${current}`);
        }
      }
    }
    
    result.push('BFS traversal completed!');
    setTraversalResult([...result]);
  };

  const runDFS = async () => {
    const visited = new Set();
    const stack = [startNode];
    const result = [];
    
    result.push(`Starting DFS from node ${startNode}`);

    while (stack.length > 0) {
      const current = stack.pop();
      
      if (!visited.has(current)) {
        visited.add(current);
        setVisitedNodes(Array.from(visited));
        setTraversalResult([...result]);
        
        result.push(`Visiting node ${current}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const neighbors = graph.edges
          .filter(edge => edge.from === current)
          .map(edge => edge.to)
          .concat(
            graph.edges
              .filter(edge => edge.to === current)
              .map(edge => edge.from)
          )
          .reverse();

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }
    
    result.push('DFS traversal completed!');
    setTraversalResult([...result]);
  };

  const resetGraph = () => {
    setVisitedNodes([]);
    setTraversalResult([]);
  };

  const Node = ({ node }) => (
    <div
      className={`graph-node ${
        visitedNodes.includes(node.id) ? 'visited' : ''
      } ${
        node.id === startNode ? 'start-node' : ''
      }`}
      style={{ left: node.x, top: node.y }}
    >
      <span className="node-label">{node.id}</span>
      {node.id === startNode && <div className="start-indicator">START</div>}
    </div>
  );

  const Edge = ({ edge }) => {
    const fromNode = graph.nodes.find(n => n.id === edge.from);
    const toNode = graph.nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    return (
      <div
        className="graph-edge"
        style={{
          left: fromNode.x + 25,
          top: fromNode.y + 25,
          width: length,
          transform: `rotate(${angle}deg)`
        }}
      >
        <div className="edge-weight">{edge.weight}</div>
      </div>
    );
  };

  return (
    <div className="graph-visualizer fade-in">
      <div className="visualizer-header">
        <h1>Graph Algorithms</h1>
        <p>Visualize graph traversal algorithms on interactive graphs</p>
      </div>

      <div className="control-panel glass">
        <div className="graph-controls">
          <div className="input-group">
            <label>Start Node:</label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              disabled={isAnimating}
            >
              {graph.nodes.map(node => (
                <option key={node.id} value={node.id}>
                  Node {node.id}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Algorithm:</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              disabled={isAnimating}
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
            onClick={handleAlgorithmRun}
            disabled={isAnimating}
          >
            {isAnimating ? '🔄 Running...' : '🚀 Run Algorithm'}
          </button>
          <button
            className="btn secondary-btn"
            onClick={resetGraph}
            disabled={isAnimating}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="visualization-area">
        <div className="graph-container">
          {graph.edges.map((edge, index) => (
            <Edge key={index} edge={edge} />
          ))}
          {graph.nodes.map((node) => (
            <Node key={node.id} node={node} />
          ))}
        </div>
      </div>

      {traversalResult.length > 0 && (
        <div className="result-panel glass">
          <h3>Traversal Steps</h3>
          <div className="traversal-steps">
            {traversalResult.slice(-8).map((step, index) => (
              <div key={index} className="traversal-step">
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-panel glass">
        <div className="algorithm-info">
          <h3>
            {selectedAlgorithm === 'bfs' 
              ? 'Breadth-First Search (BFS)' 
              : 'Depth-First Search (DFS)'
            }
          </h3>
          <p>
            {selectedAlgorithm === 'bfs'
              ? 'BFS explores all neighbors at the present depth prior to moving on to nodes at the next depth level. Uses a queue.'
              : 'DFS explores as far as possible along each branch before backtracking. Uses a stack.'
            }
          </p>
        </div>

        <div className="complexity-info">
          <h4>Time & Space Complexity</h4>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="complexity-type">Time Complexity</span>
              <span className="complexity-value">O(V + E)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-type">Space Complexity</span>
              <span className="complexity-value">O(V)</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-type">Visited Nodes</span>
              <span className="complexity-value">{visitedNodes.length}</span>
            </div>
            <div className="complexity-item">
              <span className="complexity-type">Total Nodes</span>
              <span className="complexity-value">{graph.nodes.length}</span>
            </div>
          </div>
        </div>

        <div className="graph-stats">
          <h4>Graph Statistics</h4>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Nodes (Vertices)</span>
              <span className="stat-value">{graph.nodes.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Edges</span>
              <span className="stat-value">{graph.edges.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Density</span>
              <span className="stat-value">
                {((2 * graph.edges.length) / (graph.nodes.length * (graph.nodes.length - 1))).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphVisualizer;