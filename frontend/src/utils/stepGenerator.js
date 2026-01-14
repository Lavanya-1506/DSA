// Step-by-step algorithm execution and visualization generator
export class StepGenerator {
  constructor() {
    this.steps = [];
    this.currentStep = 0;
    this.speed = 500;
    this.isPlaying = false;
    this.onStepChange = null;
    this.onComplete = null;
  }

  // Generate steps for sorting algorithms
  generateSortingSteps(algorithm, array) {
    this.steps = [];
    this.currentStep = 0;

    switch (algorithm) {
      case 'bubble-sort':
        return this.generateBubbleSortSteps(array);
      case 'quick-sort':
        return this.generateQuickSortSteps(array);
      case 'merge-sort':
        return this.generateMergeSortSteps(array);
      default:
        return this.generateGenericSteps(array);
    }
  }

  // Generate steps for searching algorithms
  generateSearchingSteps(algorithm, array, target) {
    this.steps = [];
    this.currentStep = 0;

    switch (algorithm) {
      case 'linear-search':
        return this.generateLinearSearchSteps(array, target);
      case 'binary-search':
        return this.generateBinarySearchSteps(array, target);
      default:
        return this.generateGenericSearchSteps(array, target);
    }
  }

  // Generate steps for graph algorithms
  generateGraphSteps(algorithm, graph, startNode) {
    this.steps = [];
    this.currentStep = 0;

    switch (algorithm) {
      case 'bfs':
        return this.generateBFSSteps(graph, startNode);
      case 'dfs':
        return this.generateDFSSteps(graph, startNode);
      default:
        return this.generateGenericGraphSteps(graph, startNode);
    }
  }

  // Bubble Sort step generation
  generateBubbleSortSteps(array) {
    const steps = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      type: 'initialize',
      message: `Starting Bubble Sort on array of size ${n}`,
      array: [...arr],
      highlighted: []
    });

    for (let i = 0; i < n - 1; i++) {
      steps.push({
        type: 'outer-loop',
        message: `Outer loop iteration ${i + 1}/${n - 1}`,
        array: [...arr],
        highlighted: [],
        currentI: i
      });

      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          type: 'compare',
          message: `Comparing elements at positions ${j} and ${j + 1}`,
          array: [...arr],
          highlighted: [j, j + 1],
          currentJ: j
        });

        if (arr[j] > arr[j + 1]) {
          steps.push({
            type: 'swap',
            message: `Swapping ${arr[j]} and ${arr[j + 1]}`,
            array: [...arr],
            highlighted: [j, j + 1],
            swapping: [j, j + 1]
          });

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          
          steps.push({
            type: 'swapped',
            message: `Successfully swapped elements`,
            array: [...arr],
            highlighted: [j, j + 1]
          });
        } else {
          steps.push({
            type: 'no-swap',
            message: `No swap needed - elements are in order`,
            array: [...arr],
            highlighted: [j, j + 1]
          });
        }
      }

      steps.push({
        type: 'element-sorted',
        message: `Element at position ${n - i - 1} is now in its final position`,
        array: [...arr],
        highlighted: [n - i - 1],
        sorted: n - i - 1
      });
    }

    steps.push({
      type: 'complete',
      message: 'Bubble Sort completed! Array is now sorted.',
      array: [...arr],
      highlighted: [],
      sorted: Array.from({ length: n }, (_, i) => i)
    });

    this.steps = steps;
    return steps;
  }

  // Quick Sort step generation
  generateQuickSortSteps(array) {
    const steps = [];
    const arr = [...array];

    steps.push({
      type: 'initialize',
      message: `Starting Quick Sort on array of size ${arr.length}`,
      array: [...arr],
      highlighted: []
    });

    const quickSort = (low, high) => {
      if (low < high) {
        const pivotIndex = partition(low, high);
        quickSort(low, pivotIndex - 1);
        quickSort(pivotIndex + 1, high);
      }
    };

    const partition = (low, high) => {
      const pivot = arr[high];
      
      steps.push({
        type: 'select-pivot',
        message: `Selected pivot: ${pivot} at position ${high}`,
        array: [...arr],
        highlighted: [high],
        pivot: high
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push({
          type: 'compare-with-pivot',
          message: `Comparing ${arr[j]} with pivot ${pivot}`,
          array: [...arr],
          highlighted: [j, high],
          currentJ: j,
          pivot: high
        });

        if (arr[j] < pivot) {
          i++;
          
          if (i !== j) {
            steps.push({
              type: 'swap',
              message: `Swapping ${arr[i]} and ${arr[j]}`,
              array: [...arr],
              highlighted: [i, j],
              swapping: [i, j]
            });

            [arr[i], arr[j]] = [arr[j], arr[i]];
            
            steps.push({
              type: 'swapped',
              message: `Successfully swapped elements`,
              array: [...arr],
              highlighted: [i, j]
            });
          }
        }
      }

      steps.push({
        type: 'place-pivot',
        message: `Placing pivot in its correct position`,
        array: [...arr],
        highlighted: [i + 1, high],
        swapping: [i + 1, high]
      });

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      
      steps.push({
        type: 'pivot-placed',
        message: `Pivot placed at position ${i + 1}`,
        array: [...arr],
        highlighted: [i + 1],
        pivotPosition: i + 1
      });

      return i + 1;
    };

    quickSort(0, arr.length - 1);

    steps.push({
      type: 'complete',
      message: 'Quick Sort completed! Array is now sorted.',
      array: [...arr],
      highlighted: [],
      sorted: Array.from({ length: arr.length }, (_, i) => i)
    });

    this.steps = steps;
    return steps;
  }

  // Linear Search step generation
  generateLinearSearchSteps(array, target) {
    const steps = [];
    
    steps.push({
      type: 'initialize',
      message: `Starting Linear Search for target ${target}`,
      array: [...array],
      target: target,
      highlighted: []
    });

    for (let i = 0; i < array.length; i++) {
      steps.push({
        type: 'check-element',
        message: `Checking element at position ${i}: ${array[i]}`,
        array: [...array],
        target: target,
        highlighted: [i],
        currentIndex: i
      });

      if (array[i] === target) {
        steps.push({
          type: 'found',
          message: `Target ${target} found at position ${i}!`,
          array: [...array],
          target: target,
          highlighted: [i],
          foundAt: i
        });
        this.steps = steps;
        return steps;
      } else {
        steps.push({
          type: 'not-found',
          message: `Element ${array[i]} is not the target`,
          array: [...array],
          target: target,
          highlighted: [i],
          checked: i
        });
      }
    }

    steps.push({
      type: 'not-found-complete',
      message: `Target ${target} not found in the array`,
      array: [...array],
      target: target,
      highlighted: []
    });

    this.steps = steps;
    return steps;
  }

  // Binary Search step generation
  generateBinarySearchSteps(array, target) {
    const steps = [];
    let left = 0;
    let right = array.length - 1;

    steps.push({
      type: 'initialize',
      message: `Starting Binary Search for target ${target} in sorted array`,
      array: [...array],
      target: target,
      highlighted: [],
      left: left,
      right: right
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'calculate-mid',
        message: `Calculating mid point: (${left} + ${right}) / 2 = ${mid}`,
        array: [...array],
        target: target,
        highlighted: [mid],
        left: left,
        right: right,
        mid: mid
      });

      steps.push({
        type: 'check-mid',
        message: `Checking element at mid position ${mid}: ${array[mid]}`,
        array: [...array],
        target: target,
        highlighted: [mid],
        currentIndex: mid
      });

      if (array[mid] === target) {
        steps.push({
          type: 'found',
          message: `Target ${target} found at position ${mid}!`,
          array: [...array],
          target: target,
          highlighted: [mid],
          foundAt: mid
        });
        this.steps = steps;
        return steps;
      } else if (array[mid] < target) {
        steps.push({
          type: 'go-right',
          message: `Target is greater than ${array[mid]}, searching right half`,
          array: [...array],
          target: target,
          highlighted: Array.from({ length: right - mid + 1 }, (_, i) => mid + i),
          left: mid + 1,
          right: right
        });
        left = mid + 1;
      } else {
        steps.push({
          type: 'go-left',
          message: `Target is less than ${array[mid]}, searching left half`,
          array: [...array],
          target: target,
          highlighted: Array.from({ length: mid - left + 1 }, (_, i) => left + i),
          left: left,
          right: mid - 1
        });
        right = mid - 1;
      }
    }

    steps.push({
      type: 'not-found-complete',
      message: `Target ${target} not found in the array`,
      array: [...array],
      target: target,
      highlighted: []
    });

    this.steps = steps;
    return steps;
  }

  // BFS step generation
  generateBFSSteps(graph, startNode) {
    const steps = [];
    const visited = new Set();
    const queue = [startNode];
    
    visited.add(startNode);

    steps.push({
      type: 'initialize',
      message: `Starting BFS from node ${startNode}`,
      graph: JSON.parse(JSON.stringify(graph)),
      visited: [...visited],
      queue: [...queue],
      current: startNode
    });

    while (queue.length > 0) {
      const current = queue.shift();
      
      steps.push({
        type: 'visit',
        message: `Visiting node ${current}`,
        graph: JSON.parse(JSON.stringify(graph)),
        visited: [...visited],
        queue: [...queue],
        current: current,
        visiting: current
      });

      const neighbors = this.getNeighbors(graph, current);
      
      steps.push({
        type: 'get-neighbors',
        message: `Getting neighbors of ${current}: ${neighbors.join(', ')}`,
        graph: JSON.parse(JSON.stringify(graph)),
        visited: [...visited],
        queue: [...queue],
        current: current,
        neighbors: neighbors
      });

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          
          steps.push({
            type: 'discover',
            message: `Discovered new node: ${neighbor}`,
            graph: JSON.parse(JSON.stringify(graph)),
            visited: [...visited],
            queue: [...queue],
            current: current,
            discovered: neighbor
          });
        }
      }
    }

    steps.push({
      type: 'complete',
      message: 'BFS traversal completed!',
      graph: JSON.parse(JSON.stringify(graph)),
      visited: [...visited],
      queue: [],
      current: null
    });

    this.steps = steps;
    return steps;
  }

  // Utility method to get neighbors from graph
  getNeighbors(graph, node) {
    const neighbors = [];
    graph.edges.forEach(edge => {
      if (edge.from === node && !neighbors.includes(edge.to)) {
        neighbors.push(edge.to);
      }
      if (edge.to === node && !neighbors.includes(edge.from)) {
        neighbors.push(edge.from);
      }
    });
    return neighbors;
  }

  // Step navigation methods
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      if (this.onStepChange) {
        this.onStepChange(this.steps[this.currentStep], this.currentStep);
      }
    } else if (this.currentStep === this.steps.length - 1 && this.onComplete) {
      this.onComplete();
    }
    return this.steps[this.currentStep];
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      if (this.onStepChange) {
        this.onStepChange(this.steps[this.currentStep], this.currentStep);
      }
    }
    return this.steps[this.currentStep];
  }

  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex;
      if (this.onStepChange) {
        this.onStepChange(this.steps[this.currentStep], this.currentStep);
      }
    }
    return this.steps[this.currentStep];
  }

  reset() {
    this.currentStep = 0;
    this.isPlaying = false;
    if (this.onStepChange) {
      this.onStepChange(this.steps[this.currentStep], this.currentStep);
    }
  }

  async play() {
    this.isPlaying = true;
    while (this.isPlaying && this.currentStep < this.steps.length - 1) {
      await this.nextStep();
      await new Promise(resolve => setTimeout(resolve, this.speed));
    }
    this.isPlaying = false;
  }

  pause() {
    this.isPlaying = false;
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed;
  }

  // Generic step generators for fallback
  generateGenericSteps(array) {
    return [{
      type: 'generic',
      message: 'Step-by-step visualization not available for this algorithm',
      array: [...array],
      highlighted: []
    }];
  }

  generateGenericSearchSteps(array, target) {
    return [{
      type: 'generic',
      message: `Searching for ${target} in array`,
      array: [...array],
      target: target,
      highlighted: []
    }];
  }

  generateGenericGraphSteps(graph, startNode) {
    return [{
      type: 'generic',
      message: `Graph traversal starting from ${startNode}`,
      graph: JSON.parse(JSON.stringify(graph)),
      startNode: startNode
    }];
  }
}

// Export utility functions
export const StepUtils = {
  createStep(type, data) {
    return {
      type,
      timestamp: new Date().toISOString(),
      ...data
    };
  },

  validateSteps(steps) {
    return steps.every(step => 
      step.type && 
      step.message && 
      (step.array || step.graph)
    );
  },

  filterStepsByType(steps, type) {
    return steps.filter(step => step.type === type);
  },

  getStepSummary(steps) {
    const summary = {
      totalSteps: steps.length,
      stepTypes: {},
      operations: 0,
      comparisons: 0,
      swaps: 0
    };

    steps.forEach(step => {
      summary.stepTypes[step.type] = (summary.stepTypes[step.type] || 0) + 1;
      
      if (step.type === 'compare') summary.comparisons++;
      if (step.type === 'swap') summary.swaps++;
      summary.operations++;
    });

    return summary;
  },

  exportSteps(steps, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(steps, null, 2);
      case 'csv':
        return StepUtils.convertToCSV(steps);
      default:
        return steps;
    }
  },

  convertToCSV(steps) {
    const headers = ['Step', 'Type', 'Message', 'Timestamp'];
    const rows = steps.map((step, index) => [
      index + 1,
      step.type,
      `${step.message}`,
      step.timestamp
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
};

export default {
  StepGenerator,
  StepUtils
};