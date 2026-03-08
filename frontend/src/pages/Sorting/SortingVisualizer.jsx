import React, { useState } from 'react';
import './SortingVisualizer.css';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const algorithmMeta = {
  bubble: {
    label: 'Bubble Sort',
    complexity: 'O(n^2)',
    bestCase: 'O(n)',
    worstCase: 'O(n^2)',
    space: 'O(1)',
    stability: 'Stable',
    whenToUse: 'Useful for very small or nearly sorted datasets.',
    summary: 'Bubble sort repeatedly swaps adjacent out-of-order elements until the array is sorted.',
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  },
  quick: {
    label: 'Quick Sort',
    complexity: 'O(n log n)',
    bestCase: 'O(n log n)',
    worstCase: 'O(n^2)',
    space: 'O(log n)',
    stability: 'Unstable',
    whenToUse: 'Great general-purpose in-memory sorting with good average performance.',
    summary: 'Quick sort partitions around a pivot and recursively sorts left and right partitions.',
    code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return arr;
  const p = partition(arr, low, high);
  quickSort(arr, low, p - 1);
  quickSort(arr, p + 1, high);
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  },
  merge: {
    label: 'Merge Sort',
    complexity: 'O(n log n)',
    bestCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    space: 'O(n)',
    stability: 'Stable',
    whenToUse: 'Preferred when stable sorting is required and extra memory is acceptable.',
    summary: 'Merge sort divides the array, sorts halves recursively, and merges them in order.',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}`,
  },
};

function generateRandomArray() {
  return Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 10);
}

function SortingVisualizer() {
  const [array, setArray] = useState(generateRandomArray());
  const [isSorting, setIsSorting] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [currentStepText, setCurrentStepText] = useState('Select an algorithm and click Start Sorting.');

  const algorithms = [
    { id: 'bubble', name: 'Bubble Sort', complexity: 'O(n^2)' },
    { id: 'quick', name: 'Quick Sort', complexity: 'O(n log n)' },
    { id: 'merge', name: 'Merge Sort', complexity: 'O(n log n)' },
  ];

  const runBubbleSort = async (working) => {
    for (let i = 0; i < working.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < working.length - i - 1; j++) {
        setCurrentStepText(`Pass ${i + 1}: compare ${working[j]} and ${working[j + 1]}.`);
        await sleep(170);
        if (working[j] > working[j + 1]) {
          [working[j], working[j + 1]] = [working[j + 1], working[j]];
          setArray([...working]);
          swapped = true;
          setCurrentStepText(`Swapped ${working[j + 1]} and ${working[j]}.`);
          await sleep(170);
        }
      }
      if (!swapped) {
        setCurrentStepText(`No swaps in pass ${i + 1}. Array already sorted.`);
        break;
      }
    }
  };

  const partition = async (working, low, high) => {
    const pivot = working[high];
    let i = low - 1;
    setCurrentStepText(`Partition [${low}, ${high}] with pivot ${pivot}.`);
    await sleep(210);

    for (let j = low; j < high; j++) {
      setCurrentStepText(`Compare ${working[j]} with pivot ${pivot}.`);
      await sleep(170);
      if (working[j] <= pivot) {
        i++;
        if (i !== j) {
          [working[i], working[j]] = [working[j], working[i]];
          setArray([...working]);
          setCurrentStepText(`Move ${working[i]} to left partition.`);
          await sleep(170);
        }
      }
    }

    [working[i + 1], working[high]] = [working[high], working[i + 1]];
    setArray([...working]);
    setCurrentStepText(`Placed pivot ${pivot} at index ${i + 1}.`);
    await sleep(210);
    return i + 1;
  };

  const quickSortRecursive = async (working, low, high) => {
    if (low >= high) return;
    const p = await partition(working, low, high);
    await quickSortRecursive(working, low, p - 1);
    await quickSortRecursive(working, p + 1, high);
  };

  const runQuickSort = async (working) => {
    await quickSortRecursive(working, 0, working.length - 1);
  };

  const mergeRanges = async (working, left, mid, right) => {
    const leftArr = working.slice(left, mid + 1);
    const rightArr = working.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    setCurrentStepText(`Merge [${left}, ${mid}] and [${mid + 1}, ${right}].`);
    await sleep(210);

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        working[k++] = leftArr[i++];
      } else {
        working[k++] = rightArr[j++];
      }
      setArray([...working]);
      await sleep(150);
    }

    while (i < leftArr.length) {
      working[k++] = leftArr[i++];
      setArray([...working]);
      await sleep(140);
    }

    while (j < rightArr.length) {
      working[k++] = rightArr[j++];
      setArray([...working]);
      await sleep(140);
    }
  };

  const mergeSortRecursive = async (working, left, right) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    await mergeSortRecursive(working, left, mid);
    await mergeSortRecursive(working, mid + 1, right);
    await mergeRanges(working, left, mid, right);
  };

  const runMergeSort = async (working) => {
    await mergeSortRecursive(working, 0, working.length - 1);
  };

  const handleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    setCurrentStepText(`Starting ${algorithmMeta[selectedAlgorithm].label}...`);

    try {
      const working = [...array];
      if (selectedAlgorithm === 'bubble') await runBubbleSort(working);
      else if (selectedAlgorithm === 'quick') await runQuickSort(working);
      else await runMergeSort(working);

      setArray([...working]);
      setCurrentStepText(`${algorithmMeta[selectedAlgorithm].label} complete. Array is sorted.`);
    } finally {
      setIsSorting(false);
    }
  };

  const resetArray = () => {
    setArray(generateRandomArray());
    setCurrentStepText('Generated a new random array.');
  };

  return (
    <div className="sorting-visualizer fade-in">
      <div className="visualizer-header">
        <h1>Sorting Algorithms</h1>
        <p>Visualize how different sorting algorithms work step by step</p>
      </div>

      <div className="control-panel glass">
        <div className="algorithm-selector">
          <label>Select Algorithm:</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isSorting}
          >
            {algorithms.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name} ({algo.complexity})
              </option>
            ))}
          </select>
        </div>

        <div className="control-buttons">
          <button className="btn primary-btn" onClick={handleSort} disabled={isSorting}>
            {isSorting ? 'Sorting...' : 'Start Sorting'}
          </button>
          <button className="btn secondary-btn" onClick={resetArray} disabled={isSorting}>
            New Array
          </button>
          <button className="btn secondary-btn" disabled>
            Pause
          </button>
        </div>
      </div>

      <div className="visualization-area">
        <div className="sorting-panel glass">
          <div className="array-container">
            {array.map((value, index) => (
              <div
                key={index}
                className="array-bar"
                style={{
                  height: `${value}%`,
                  backgroundColor: `hsl(${value * 3}, 70%, 60%)`,
                }}
              >
                <span className="bar-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="algorithm-steps glass">
          <h3>Current Iteration</h3>
          <div className="step-text">{currentStepText}</div>
        </div>
      </div>

      <div className="info-panel glass">
        <h3>Algorithm Information</h3>
        <div className="algorithm-extra">
          <h4>About this algorithm</h4>
          <p>{algorithmMeta[selectedAlgorithm].summary}</p>
          <div className="extra-grid">
            <div className="extra-item">
              <span className="extra-label">Best Case</span>
              <span className="extra-value">{algorithmMeta[selectedAlgorithm].bestCase}</span>
            </div>
            <div className="extra-item">
              <span className="extra-label">Worst Case</span>
              <span className="extra-value">{algorithmMeta[selectedAlgorithm].worstCase}</span>
            </div>
            <div className="extra-item extra-item-full">
              <span className="extra-label">Use Case</span>
              <span className="extra-value">{algorithmMeta[selectedAlgorithm].whenToUse}</span>
            </div>
          </div>
        </div>
        <div className="info-two-column">
          <div className="algorithm-info">
            <div className="info-item">
              <span className="info-label">Algorithm:</span>
              <span className="info-value">{algorithmMeta[selectedAlgorithm].label}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time Complexity:</span>
              <span className="info-value">{algorithmMeta[selectedAlgorithm].complexity}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Space Complexity:</span>
              <span className="info-value">{algorithmMeta[selectedAlgorithm].space}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Stability:</span>
              <span className="info-value">{algorithmMeta[selectedAlgorithm].stability}</span>
            </div>
          </div>

          <div className="code-preview">
            <h4>Code Preview:</h4>
            <pre>{algorithmMeta[selectedAlgorithm].code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortingVisualizer;
