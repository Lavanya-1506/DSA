// Performance metrics and analytics utilities
export class AlgorithmMetrics {
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
    this.operations = 0;
    this.comparisons = 0;
    this.swaps = 0;
    this.memoryUsage = 0;
  }

  startTimer() {
    this.startTime = performance.now();
    this.operations = 0;
    this.comparisons = 0;
    this.swaps = 0;
    this.memoryUsage = 0;
  }

  stopTimer() {
    this.endTime = performance.now();
  }

  incrementOperations(count = 1) {
    this.operations += count;
  }

  incrementComparisons(count = 1) {
    this.comparisons += count;
    this.incrementOperations(count);
  }

  incrementSwaps(count = 1) {
    this.swaps += count;
    this.incrementOperations(count);
  }

  setMemoryUsage(usage) {
    this.memoryUsage = usage;
  }

  getMetrics() {
    const timeTaken = this.endTime - this.startTime;
    return {
      timeTaken: timeTaken.toFixed(2) + ' ms',
      operations: this.operations,
      comparisons: this.comparisons,
      swaps: this.swaps,
      memoryUsage: this.formatMemory(this.memoryUsage),
      efficiency: this.calculateEfficiency()
    };
  }

  calculateEfficiency() {
    if (this.operations === 0) return 'N/A';
    
    const timePerOperation = (this.endTime - this.startTime) / this.operations;
    if (timePerOperation < 0.1) return 'Excellent';
    if (timePerOperation < 1) return 'Good';
    if (timePerOperation < 10) return 'Average';
    return 'Poor';
  }

  formatMemory(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Complexity analysis utilities
export const ComplexityAnalyzer = {
  // Time complexity analysis
  analyzeTimeComplexity(algorithm, inputSize) {
    const complexities = {
      'bubble-sort': {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
        description: 'Quadratic time complexity'
      },
      'quick-sort': {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)',
        description: 'Linearithmic average case'
      },
      'merge-sort': {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)',
        description: 'Linearithmic in all cases'
      },
      'linear-search': {
        best: 'O(1)',
        average: 'O(n)',
        worst: 'O(n)',
        description: 'Linear time complexity'
      },
      'binary-search': {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)',
        description: 'Logarithmic time complexity'
      },
      'bfs': {
        best: 'O(V + E)',
        average: 'O(V + E)',
        worst: 'O(V + E)',
        description: 'Linear in vertices + edges'
      },
      'dfs': {
        best: 'O(V + E)',
        average: 'O(V + E)',
        worst: 'O(V + E)',
        description: 'Linear in vertices + edges'
      }
    };

    return complexities[algorithm] || {
      best: 'Unknown',
      average: 'Unknown',
      worst: 'Unknown',
      description: 'Complexity analysis not available'
    };
  },

  // Space complexity analysis
  analyzeSpaceComplexity(algorithm) {
    const spaceComplexities = {
      'bubble-sort': 'O(1)',
      'quick-sort': 'O(log n)',
      'merge-sort': 'O(n)',
      'linear-search': 'O(1)',
      'binary-search': 'O(1)',
      'bfs': 'O(V)',
      'dfs': 'O(V)'
    };

    return spaceComplexities[algorithm] || 'Unknown';
  },

  // Calculate expected operations for given input size
  calculateExpectedOperations(algorithm, inputSize) {
    const expectations = {
      'bubble-sort': inputSize * inputSize,
      'quick-sort': inputSize * Math.log2(inputSize),
      'merge-sort': inputSize * Math.log2(inputSize),
      'linear-search': inputSize / 2, // Average case
      'binary-search': Math.log2(inputSize),
      'bfs': inputSize * 2, // Approximate for connected graphs
      'dfs': inputSize * 2
    };

    return Math.round(expectations[algorithm] || inputSize);
  }
};

// Performance comparison utilities
export const PerformanceComparator = {
  compareAlgorithms(algorithms, inputSizes) {
    const results = {};
    
    algorithms.forEach(algorithm => {
      results[algorithm] = {};
      inputSizes.forEach(size => {
        const expectedOps = ComplexityAnalyzer.calculateExpectedOperations(algorithm, size);
        const complexity = ComplexityAnalyzer.analyzeTimeComplexity(algorithm, size);
        
        results[algorithm][size] = {
          expectedOperations: expectedOps,
          timeComplexity: complexity,
          efficiency: this.calculateEfficiencyScore(algorithm, size)
        };
      });
    });
    
    return results;
  },

  calculateEfficiencyScore(algorithm, inputSize) {
    const baseScores = {
      'bubble-sort': 3,
      'quick-sort': 9,
      'merge-sort': 8,
      'linear-search': 5,
      'binary-search': 10,
      'bfs': 7,
      'dfs': 7
    };

    const baseScore = baseScores[algorithm] || 5;
    const sizeFactor = Math.log10(inputSize) / 10;
    
    return Math.min(10, baseScore + sizeFactor);
  },

  generatePerformanceReport(metrics, algorithm, inputSize) {
    const complexity = ComplexityAnalyzer.analyzeTimeComplexity(algorithm, inputSize);
    const expectedOps = ComplexityAnalyzer.calculateExpectedOperations(algorithm, inputSize);
    
    return {
      algorithm,
      inputSize,
      actualMetrics: metrics,
      expectedComplexity: complexity,
      expectedOperations: expectedOps,
      performanceRatio: metrics.operations / expectedOps,
      recommendation: this.getRecommendation(algorithm, metrics.operations, expectedOps)
    };
  },

  getRecommendation(algorithm, actualOps, expectedOps) {
    const ratio = actualOps / expectedOps;
    
    if (ratio < 1.1) {
      return 'Excellent performance - algorithm is working optimally';
    } else if (ratio < 1.5) {
      return 'Good performance - minor optimizations possible';
    } else if (ratio < 2) {
      return 'Average performance - consider algorithm improvements';
    } else {
      return 'Poor performance - significant optimizations needed';
    }
  }
};

// Real-time performance monitoring
export const PerformanceMonitor = {
  metrics: new AlgorithmMetrics(),
  history: [],
  
  startMonitoring(algorithmName, inputSize) {
    this.metrics.startTimer();
    this.currentAlgorithm = algorithmName;
    this.inputSize = inputSize;
  },
  
  recordOperation(type, count = 1) {
    switch (type) {
      case 'comparison':
        this.metrics.incrementComparisons(count);
        break;
      case 'swap':
        this.metrics.incrementSwaps(count);
        break;
      case 'operation':
        this.metrics.incrementOperations(count);
        break;
    }
  },
  
  stopMonitoring() {
    this.metrics.stopTimer();
    const results = this.metrics.getMetrics();
    
    const performanceData = {
      algorithm: this.currentAlgorithm,
      inputSize: this.inputSize,
      timestamp: new Date().toISOString(),
      ...results
    };
    
    this.history.push(performanceData);
    return performanceData;
  },
  
  getPerformanceHistory() {
    return this.history;
  },
  
  clearHistory() {
    this.history = [];
  },
  
  getAveragePerformance(algorithm) {
    const algorithmHistory = this.history.filter(entry => entry.algorithm === algorithm);
    
    if (algorithmHistory.length === 0) return null;
    
    const averages = {
      timeTaken: 0,
      operations: 0,
      comparisons: 0,
      swaps: 0
    };
    
    algorithmHistory.forEach(entry => {
      averages.timeTaken += parseFloat(entry.timeTaken);
      averages.operations += entry.operations;
      averages.comparisons += entry.comparisons;
      averages.swaps += entry.swaps;
    });
    
    Object.keys(averages).forEach(key => {
      averages[key] = averages[key] / algorithmHistory.length;
    });
    
    return averages;
  }
};

// Export utility functions
export const MetricUtils = {
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
  },
  
  calculateProgress(current, total) {
    return Math.min(100, (current / total) * 100);
  },
  
  generatePerformanceInsights(metrics) {
    const insights = [];
    
    if (metrics.comparisons > metrics.swaps * 10) {
      insights.push('High comparison-to-swap ratio suggests efficient movement');
    }
    
    if (metrics.timeTaken < 10) {
      insights.push('Excellent execution speed');
    } else if (metrics.timeTaken > 1000) {
      insights.push('Consider optimizing for larger inputs');
    }
    
    if (metrics.operations < 100) {
      insights.push('Low operation count indicates good algorithm choice');
    }
    
    return insights;
  }
};

export default {
  AlgorithmMetrics,
  ComplexityAnalyzer,
  PerformanceComparator,
  PerformanceMonitor,
  MetricUtils
};
