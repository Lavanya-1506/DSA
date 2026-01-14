// Breadth-First Search implementation
export const bfs = (graph, startNode) => {
  const animations = [];
  const visited = new Set();
  const queue = [startNode];
  const result = [];
  
  visited.add(startNode);

  animations.push({
    type: 'initialize',
    message: `Starting BFS from node ${startNode}`,
    visited: [...visited],
    queue: [...queue],
    current: startNode,
    result: [...result]
  });

  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);

    animations.push({
      type: 'visit',
      message: `Visiting node ${current}`,
      visited: [...visited],
      queue: [...queue],
      current: current,
      visiting: current,
      result: [...result]
    });

    const neighbors = getNeighbors(graph, current);
    
    animations.push({
      type: 'get-neighbors',
      message: `Getting neighbors of ${current}: ${neighbors.join(', ')}`,
      visited: [...visited],
      queue: [...queue],
      current: current,
      neighbors: neighbors,
      result: [...result]
    });

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        
        animations.push({
          type: 'discover',
          message: `Discovered new node: ${neighbor}`,
          visited: [...visited],
          queue: [...queue],
          current: current,
          discovered: neighbor,
          result: [...result]
        });
      } else {
        animations.push({
          type: 'already-visited',
          message: `Node ${neighbor} already visited, skipping`,
          visited: [...visited],
          queue: [...queue],
          current: current,
          neighbor: neighbor,
          result: [...result]
        });
      }
    }

    animations.push({
      type: 'level-complete',
      message: `Completed processing level for node ${current}`,
      visited: [...visited],
      queue: [...queue],
      current: current,
      result: [...result]
    });
  }

  animations.push({
    type: 'complete',
    message: 'BFS traversal completed!',
    visited: [...visited],
    queue: [...queue],
    result: [...result],
    traversalOrder: [...result]
  });

  return { result, animations };
};

// BFS for shortest path (unweighted graph)
export const bfsShortestPath = (graph, startNode, endNode) => {
  const animations = [];
  const visited = new Set();
  const queue = [[startNode, [startNode]]]; // [currentNode, path]
  const distances = { [startNode]: 0 };
  
  visited.add(startNode);

  animations.push({
    type: 'initialize-shortest-path',
    message: `Finding shortest path from ${startNode} to ${endNode}`,
    visited: [...visited],
    queue: queue.map(([node]) => node),
    current: startNode,
    path: [startNode],
    distance: 0
  });

  while (queue.length > 0) {
    const [current, path] = queue.shift();

    animations.push({
      type: 'visit-node',
      message: `Visiting node ${current}, current path: ${path.join(' → ')}`,
      visited: [...visited],
      queue: queue.map(([node]) => node),
      current: current,
      path: [...path],
      distance: path.length - 1
    });

    if (current === endNode) {
      animations.push({
        type: 'path-found',
        message: `Shortest path found! Distance: ${path.length - 1}, Path: ${path.join(' → ')}`,
        path: [...path],
        distance: path.length - 1,
        visited: [...visited]
      });
      return { path, distance: path.length - 1, animations };
    }

    const neighbors = getNeighbors(graph, current);
    
    animations.push({
      type: 'check-neighbors',
      message: `Checking neighbors of ${current}: ${neighbors.join(', ')}`,
      visited: [...visited],
      queue: queue.map(([node]) => node),
      current: current,
      neighbors: neighbors
    });

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const newPath = [...path, neighbor];
        queue.push([neighbor, newPath]);
        
        animations.push({
          type: 'explore-neighbor',
          message: `Exploring neighbor ${neighbor}, new path: ${newPath.join(' → ')}`,
          visited: [...visited],
          queue: queue.map(([node]) => node),
          current: current,
          neighbor: neighbor,
          newPath: [...newPath]
        });
      } else {
        animations.push({
          type: 'skip-visited',
          message: `Skipping already visited neighbor ${neighbor}`,
          visited: [...visited],
          queue: queue.map(([node]) => node),
          current: current,
          neighbor: neighbor
        });
      }
    }
  }

  animations.push({
    type: 'no-path',
    message: `No path found from ${startNode} to ${endNode}`,
    visited: [...visited]
  });

  return { path: null, distance: -1, animations };
};

// BFS for connected components
export const bfsConnectedComponents = (graph) => {
  const animations = [];
  const visited = new Set();
  const components = [];

  animations.push({
    type: 'initialize-components',
    message: 'Finding connected components using BFS',
    visited: [...visited],
    components: [...components]
  });

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      const component = [];
      const queue = [node.id];
      visited.add(node.id);

      animations.push({
        type: 'new-component',
        message: `Starting new component from node ${node.id}`,
        visited: [...visited],
        components: [...components],
        currentComponent: [...component],
        queue: [...queue]
      });

      while (queue.length > 0) {
        const current = queue.shift();
        component.push(current);

        animations.push({
          type: 'component-visit',
          message: `Adding node ${current} to current component`,
          visited: [...visited],
          components: [...components],
          currentComponent: [...component],
          current: current
        });

        const neighbors = getNeighbors(graph, current);
        
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            
            animations.push({
              type: 'component-discover',
              message: `Discovered node ${neighbor} for current component`,
              visited: [...visited],
              components: [...components],
              currentComponent: [...component],
              neighbor: neighbor
            });
          }
        }
      }

      components.push(component);
      
      animations.push({
        type: 'component-complete',
        message: `Completed component: [${component.join(', ')}]`,
        visited: [...visited],
        components: [...components],
        currentComponent: [...component]
      });
    }
  }

  animations.push({
    type: 'components-complete',
    message: `Found ${components.length} connected components`,
    visited: [...visited],
    components: [...components]
  });

  return { components, animations };
};

// Utility function to get neighbors
const getNeighbors = (graph, node) => {
  const neighbors = new Set();
  
  graph.edges.forEach(edge => {
    if (edge.from === node) {
      neighbors.add(edge.to);
    }
    if (edge.to === node) {
      neighbors.add(edge.from);
    }
  });
  
  return Array.from(neighbors);
};

// BFS information and analysis
export const BFSInfo = {
  name: 'Breadth-First Search',
  description: 'A graph traversal algorithm that explores all neighbors at the present depth prior to moving on to nodes at the next depth level.',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)'
  },
  spaceComplexity: 'O(V)',
  applications: [
    'Shortest path in unweighted graphs',
    'Web crawling',
    'Social networking (friends of friends)',
    'GPS navigation systems',
    'Finding connected components'
  ],
  properties: {
    traversal: 'Level-order',
    dataStructure: 'Queue',
    completeness: 'Yes (for finite graphs)',
    optimality: 'Yes (for unweighted graphs)'
  },
  steps: [
    'Start from the root node',
    'Visit all neighbors at current depth',
    'Move to next depth level',
    'Repeat until all nodes are visited'
  ]
};

export default bfs;