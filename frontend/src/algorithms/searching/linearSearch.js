export const linearSearch = (array, target) => {
  const animations = [];
  
  for (let i = 0; i < array.length; i++) {
    animations.push({ type: 'check', index: i });
    
    if (array[i] === target) {
      animations.push({ type: 'found', index: i });
      return { index: i, animations };
    }
  }
  
  animations.push({ type: 'not-found' });
  return { index: -1, animations };
};

export const linearSearchInfo = {
  name: 'Linear Search',
  description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)'
  },
  spaceComplexity: 'O(1)'
};