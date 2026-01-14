// Depth-First Search implementation
export const dfs = (graph, startNode) => {
  const animations = [];
  const visited = new Set();
  const result = [];
  
  animations.push({
    type: 'initialize',
    message: `Starting DFS from node ${startNode}`,
    visited: [...visited],
    result: [...result],
    current: startNode
  });

  const dfsRecursive = (node) => {
    visited.add(node);
    result.push(node);

    animations.push({
      type: 'visit',
      message: `Visiting node ${node}`,
      visited: [...visited],
      result: [...result],
      current: node,
      visiting: node
    });

    const neighbors = getNeighbors(graph, node);
    
    animations.push({
      type: 'get-neighbors',
      message: `Getting neighbors of ${node}: ${neighbors.join(', ')}`,
      visited: [...visited],
      result: [...result],
      current: node,
      neighbors: neighbors
    });

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        animations.push({
          type: 'go-deeper',
          message: `Moving to unvisited neighbor: ${neighbor}`,
          visited: [...visited],
          result: [...result],
          current: node,
          next: neighbor
        });

        dfsRecursive(neighbor);

        animations.push({
          type: 'backtrack',
          message: `Backtracking to node ${node}`,
          visited: [...visited],
          result: [...result],
          current: node,
          backtrackFrom: neighbor
        });
      } else {
        animations.push({
          type: 'already-visited',
          message: `Neighbor ${neighbor} already visited, skipping`,
          visited: [...visited],
          result: [...result],
          current: node,
          neighbor: neighbor
        });
      }
    }

    animations.push({
      type: 'node-complete',
      message: `Completed processing node ${node}`,
      visited: [...visited],
      result: [...result],
      current: node
    });
  };

  dfsRecursive(startNode);

  animations.push({
    type: 'complete',
    message: 'DFS traversal completed!',
    visited: [...visited],
    result: [...result],
    traversalOrder: [...result]
  });

  return { result, animations };
};

// DFS iterative implementation
export const dfsIterative = (graph, startNode) => {
  const animations = [];
  const visited = new Set();
  const stack = [startNode];
  const result = [];

  animations.push({
    type: 'initialize-iterative',
    message: `Starting iterative DFS from node ${startNode}`,
    visited: [...visited],
    stack: [...stack],
    result: [...result]
  });

  while (stack.length > 0) {
    const current = stack.pop();

    if (!visited.has(current)) {
      visited.add(current);
      result.push(current);

      animations.push({
        type: 'visit',
        message: `Visiting node ${current}`,
        visited: [...visited],
        stack: [...stack],
        result: [...result],
        current: current,
        visiting: current
      });

      const neighbors = getNeighbors(graph, current);
      
      animations.push({
        type: 'get-neighbors',
        message: `Getting neighbors of ${current}: ${neighbors.join(', ')}`,
        visited: [...visited],
        stack: [...stack],
        result: [...result],
        current: current,
        neighbors: neighbors
      });

      // Push neighbors in reverse order to maintain same order as recursive
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          
          animations.push({
            type: 'push-stack',
            message: `Pushing neighbor ${neighbor} to stack`,
            visited: [...visited],
            stack: [...stack],
            result: [...result],
            current: current,
            neighbor: neighbor
          });
        } else {
          animations.push({
            type: 'skip-visited',
            message: `Skipping already visited neighbor ${neighbor}`,
            visited: [...visited],
            stack: [...stack],
            result: [...result],
            current: current,
            neighbor: neighbor
          });
        }
      }
    }
  }

  animations.push({
    type: 'complete',
    message: 'Iterative DFS completed!',
    visited: [...visited],
    stack: [...stack],
    result: [...result],
    traversalOrder: [...result]
  });

  return { result, animations };
};

// DFS for cycle detection
export const dfsCycleDetection = (graph) => {
  const animations = [];
  const visited = new Set();
  const recursionStack = new Set();
  let hasCycle = false;

  animations.push({
    type: 'initialize-cycle-detection',
    message: 'Starting cycle detection using DFS',
    visited: [...visited],
    recursionStack: [...recursionStack],
    hasCycle: hasCycle
  });

  const dfsCycle = (node, parent) => {
    visited.add(node);
    recursionStack.add(node);

    animations.push({
      type: 'visit-node',
      message: `Visiting node ${node}, parent: ${parent || 'None'}`,
      visited: [...visited],
      recursionStack: [...recursionStack],
      current: node,
      parent: parent
    });

    const neighbors = getNeighbors(graph, node);
    
    for (const neighbor of neighbors) {
      if (neighbor === parent) {
        animations.push({
          type: 'skip-parent',
          message: `Skipping parent node ${neighbor}`,
          visited: [...visited],
          recursionStack: [...recursionStack],
          current: node,
          neighbor: neighbor
        });
        continue;
      }

      if (recursionStack.has(neighbor)) {
        hasCycle = true;
        animations.push({
          type: 'cycle-found',
          message: `Cycle detected! Back edge from ${node} to ${neighbor}`,
          visited: [...visited],
          recursionStack: [...recursionStack],
          current: node,
          neighbor: neighbor,
          hasCycle: true
        });
        return true;
      }

      if (!visited.has(neighbor)) {
        animations.push({
          type: 'go-deeper-cycle',
          message: `Moving to unvisited neighbor: ${neighbor}`,
          visited: [...visited],
          recursionStack: [...recursionStack],
          current: node,
          next: neighbor
        });

        if (dfsCycle(neighbor, node)) {
          return true;
        }
      }
    }

    recursionStack.delete(node);
    
    animations.push({
      type: 'backtrack-cycle',
      message: `Backtracking from node ${node}`,
      visited: [...visited],
      recursionStack: [...recursionStack],
      current: node
    });

    return false;
  };

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      animations.push({
        type: 'new-component-cycle',
        message: `Starting DFS from node ${node.id} for cycle detection`,
        visited: [...visited],
        recursionStack: [...recursionStack],
        startNode: node.id
      });

      if (dfsCycle(node.id, null)) {
        break;
      }
    }
  }

  animations.push({
    type: 'cycle-detection-complete',
    message: hasCycle ? 'Cycle detected in the graph!' : 'No cycles found in the graph',
    visited: [...visited],
    recursionStack: [...recursionStack],
    hasCycle: hasCycle
  });

  return { hasCycle, animations };
};

// DFS for topological sort (for DAGs)
export const dfsTopologicalSort = (graph) => {
  const animations = [];
  const visited = new Set();
  const stack = [];
  let isDAG = true;

  animations.push({
    type: 'initialize-topological',
    message: 'Starting topological sort using DFS',
    visited: [...visited],
    stack: [...stack],
    isDAG: isDAG
  });

  const topologicalSort = (node, path) => {
    visited.add(node);
    path.add(node);

    animations.push({
      type: 'visit-topological',
      message: `Visiting node ${node} for topological sort`,
      visited: [...visited],
      stack: [...stack],
      current: node,
      path: [...path]
    });

    const neighbors = getNeighbors(graph, node);
    
    for (const neighbor of neighbors) {
      if (path.has(neighbor)) {
        isDAG = false;
        animations.push({
          type: 'cycle-detected-topological',
          message: 'Cycle detected! Cannot perform topological sort on cyclic graph',
          visited: [...visited],
          stack: [...stack],
          current: node,
          neighbor: neighbor,
          isDAG: false
        });
        return false;
      }

      if (!visited.has(neighbor)) {
        animations.push({
          type: 'go-deeper-topological',
          message: `Moving to unvisited neighbor: ${neighbor}`,
          visited: [...visited],
          stack: [...stack],
          current: node,
          next: neighbor
        });

        if (!topologicalSort(neighbor, new Set(path))) {
          return false;
        }
      }
    }

    path.delete(node);
    stack.push(node);
    
    animations.push({
      type: 'push-stack-topological',
      message: `Pushing node ${node} to topological order stack`,
      visited: [...visited],
      stack: [...stack],
      current: node
    });

    return true;
  };

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      animations.push({
        type: 'new-component-topological',
        message: `Starting topological sort from node ${node.id}`,
        visited: [...visited],
        stack: [...stack],
        startNode: node.id
      });

      if (!topologicalSort(node.id, new Set())) {
        break;
      }
    }
  }

  const result = stack.reverse();
  
  animations.push({
    type: 'topological-complete',
    message: isDAG ? `Topological order: ${result.join(' → ')}` : 'Graph is not a DAG, cannot compute topological order',
    visited: [...visited],
    stack: [...stack],
    result: [...result],
    isDAG: isDAG
  });

  return { result: isDAG ? result : null, isDAG, animations };
};

// Utility function to get neighbors
const getNeighbors = (graph, node) => {
  const neighbors = new Set();
  
  graph.edges.forEach(edge => {
    if (edge.from === node) {
      neighbors.add(edge.to);
    }
    if (graph.directed !== true && edge.to === node) {
      neighbors.add(edge.from);
    }
  });
  
  return Array.from(neighbors);
};

// DFS information and analysis
export const DFSInfo = {
  name: 'Depth-First Search',
  description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V)',
  applications: [
    'Path finding',
    'Cycle detection',
    'Topological sorting',
    'Solving puzzles and mazes',
    'Finding connected components'
  ],
  properties: {
    traversal: 'Depth-first',
    dataStructure: 'Stack (recursion)',
    completeness: 'No (may not find solution in infinite graphs)',
    optimality: 'No (may not find shortest path)'
  },
  variations: {
    'Recursive DFS': 'Uses function call stack',
    'Iterative DFS': 'Uses explicit stack',
    'DFS with Path Recording': 'Tracks path during traversal',
    'DFS for Backtracking': 'Systematic trial and error'
  },
  steps: [
    'Start from the root node',
    'Explore each branch completely before backtracking',
    'Mark visited nodes to avoid cycles',
    'Continue until all nodes are visited'
  ]
};

export default dfs;