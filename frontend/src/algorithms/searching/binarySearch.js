export const binarySearch = (array, target) => {
  const animations = [];
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    animations.push({ type: 'check', index: mid });

    if (array[mid] === target) {
      animations.push({ type: 'found', index: mid });
      return { index: mid, animations };
    } else if (array[mid] < target) {
      animations.push({ type: 'eliminate', indices: [left, mid] });
      left = mid + 1;
    } else {
      animations.push({ type: 'eliminate', indices: [mid, right] });
      right = mid - 1;
    }
  }

  animations.push({ type: 'not-found' });
  return { index: -1, animations };
};

export const binarySearchInfo = {
  name: 'Binary Search',
  description: 'Efficiently finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)'
  },
  spaceComplexity: 'O(1)',
  requirements: 'Array must be sorted'
};