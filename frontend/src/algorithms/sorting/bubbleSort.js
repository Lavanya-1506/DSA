export const bubbleSort = (array) => {
  const animations = [];
  const sortedArray = [...array];
  const n = sortedArray.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare elements
      animations.push({ type: 'compare', indices: [j, j + 1] });
      
      if (sortedArray[j] > sortedArray[j + 1]) {
        // Swap elements
        animations.push({ type: 'swap', indices: [j, j + 1] });
        [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
      }
    }
    // Mark as sorted
    animations.push({ type: 'sorted', index: n - i - 1 });
  }
  
  animations.push({ type: 'sorted', index: 0 });
  return { sortedArray, animations };
};

export const bubbleSortInfo = {
  name: 'Bubble Sort',
  description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)'
  },
  spaceComplexity: 'O(1)',
  stable: true
};