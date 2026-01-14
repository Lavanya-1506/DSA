export const quickSort = (array) => {
  const animations = [];
  const sortedArray = [...array];
  
  const partition = (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      animations.push({ type: 'compare', indices: [j, high] });
      
      if (arr[j] < pivot) {
        i++;
        animations.push({ type: 'swap', indices: [i, j] });
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    
    animations.push({ type: 'swap', indices: [i + 1, high] });
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  };

  const quickSortHelper = (arr, low, high) => {
    if (low < high) {
      const pi = partition(arr, low, high);
      quickSortHelper(arr, low, pi - 1);
      quickSortHelper(arr, pi + 1, high);
    }
  };

  quickSortHelper(sortedArray, 0, sortedArray.length - 1);
  return { sortedArray, animations };
};

export const quickSortInfo = {
  name: 'Quick Sort',
  description: 'Divides the array into smaller sub-arrays around a pivot element and recursively sorts them.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(log n)',
  stable: false
};