export const mergeSort = (array) => {
  const animations = [];
  const sortedArray = [...array];

  const merge = (arr, l, m, r) => {
    const n1 = m - l + 1;
    const n2 = r - m;

    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
      animations.push({ type: 'compare', indices: [l + i, m + 1 + j] });
      
      if (L[i] <= R[j]) {
        animations.push({ type: 'overwrite', index: k, value: L[i] });
        arr[k] = L[i];
        i++;
      } else {
        animations.push({ type: 'overwrite', index: k, value: R[j] });
        arr[k] = R[j];
        j++;
      }
      k++;
    }

    while (i < n1) {
      animations.push({ type: 'overwrite', index: k, value: L[i] });
      arr[k] = L[i];
      i++;
      k++;
    }

    while (j < n2) {
      animations.push({ type: 'overwrite', index: k, value: R[j] });
      arr[k] = R[j];
      j++;
      k++;
    }
  };

  const mergeSortHelper = (arr, l, r) => {
    if (l >= r) return;
    
    const m = Math.floor((l + r) / 2);
    mergeSortHelper(arr, l, m);
    mergeSortHelper(arr, m + 1, r);
    merge(arr, l, m, r);
  };

  mergeSortHelper(sortedArray, 0, sortedArray.length - 1);
  return { sortedArray, animations };
};

export const mergeSortInfo = {
  name: 'Merge Sort',
  description: 'Divides the array into halves, recursively sorts them, and then merges the sorted halves.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)'
  },
  spaceComplexity: 'O(n)',
  stable: true
};