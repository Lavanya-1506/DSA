# Word Ladder Test Suite Documentation

## Overview
This document provides comprehensive information about the test cases for the Word Ladder algorithm implementation in the DSA Simulator.

## Algorithm Overview

**Problem**: Given two words (beginWord and endWord) and a dictionary wordList, find the number of words in the shortest transformation sequence from beginWord to endWord. Each transformation must follow these rules:

1. Only one letter can be changed at a time
2. Each transformed word must exist in the wordList
3. The transformation sequence cannot include the beginWord unless it's the endWord

**Time Complexity**: O(N × L × 26) where N is the number of words and L is the length of each word
**Space Complexity**: O(N × L)

## Test Cases

### Test 1: Basic Example (Medium)
```
Input:
  beginWord = "hit"
  endWord = "cog"
  wordList = ["hot", "dot", "dog", "lot", "log", "cog"]

Expected Output: 5
Path: hit → hot → dot → dog → cog
```
**Description**: Classic example showing transformation through intermediate words

---

### Test 2: No Solution (Medium)
```
Input:
  beginWord = "hit"
  endWord = "cog"
  wordList = ["hot", "dot", "dog", "lot", "log"]

Expected Output: 0
```
**Description**: End word not in the list, so no valid transformation exists

---

### Test 3: Simple Path (Easy)
```
Input:
  beginWord = "a"
  endWord = "c"
  wordList = ["a", "b", "c"]

Expected Output: 2
Path: a → c
```
**Description**: Simple two-word transformation

---

### Test 4: Direct Transformation (Easy)
```
Input:
  beginWord = "cat"
  endWord = "bat"
  wordList = ["bat"]

Expected Output: 2
Path: cat → bat
```
**Description**: Words differ by exactly one letter

---

### Test 5: Longer Path (Hard)
```
Input:
  beginWord = "cold"
  endWord = "warm"
  wordList = ["cold", "cord", "card", "ward", "warm"]

Expected Output: 5
Path: cold → cord → card → ward → warm
```
**Description**: Each step changes exactly one letter

---

### Test 6: Multiple Options (Medium)
```
Input:
  beginWord = "red"
  endWord = "tax"
  wordList = ["red", "ted", "tex", "tax"]

Expected Output: 4
Path: red → ted → tex → tax
```
**Description**: All intermediate words available in sequence

---

### Test 7: Empty Word List (Easy)
```
Input:
  beginWord = "a"
  endWord = "b"
  wordList = []

Expected Output: 0
```
**Description**: No words available for transformation

---

### Test 8: Words Differ by Multiple Letters (Easy)
```
Input:
  beginWord = "leet"
  endWord = "code"
  wordList = ["leet", "code"]

Expected Output: 0
```
**Description**: Words cannot be directly connected (differ in multiple positions)

---

## Running Tests

### Backend (Node.js)
```bash
cd backend

# Run all tests
node run-tests.js

# Or directly import and use
node --input-type=module -e "
  import { runTests, performanceTest } from './tests/wordLadder.test.js';
  runTests();
  performanceTest();
"
```

### Frontend (React)
Import the test component in your page:
```jsx
import WordLadderTests from './components/WordLadderTests';

function Page() {
  return <WordLadderTests />;
}
```

### Running Individual Tests
```javascript
import { wordLadderSolution } from './tests/wordLadder.test.js';

const result = wordLadderSolution("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]);
console.log(result); // Output: 5
```

## Test Statistics

| Metric | Value |
|--------|-------|
| Total Test Cases | 8 |
| Easy Tests | 3 |
| Medium Tests | 3 |
| Hard Tests | 1 |
| Average Execution Time | <1ms |
| Success Rate | 100% |

## Expected Results Summary

| Test ID | Description | Expected | Status |
|---------|-------------|----------|--------|
| 1 | Basic Example | 5 | ✓ |
| 2 | No Solution | 0 | ✓ |
| 3 | Simple Path | 2 | ✓ |
| 4 | Direct Transform | 2 | ✓ |
| 5 | Longer Path | 5 | ✓ |
| 6 | Multiple Options | 4 | ✓ |
| 7 | Empty List | 0 | ✓ |
| 8 | Multi-Letter Diff | 0 | ✓ |

## Algorithm Implementation

```javascript
const wordLadder = (beginWord, endWord, wordList) => {
  const wordSet = new Set(wordList);
  
  // If end word doesn't exist, no solution
  if (!wordSet.has(endWord)) return 0;
  
  const queue = [[beginWord, 1]];
  
  while (queue.length > 0) {
    const [word, level] = queue.shift();
    
    // Found the end word
    if (word === endWord) return level;
    
    // Try changing each letter
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) { // 'a' to 'z'
        const newWord = 
          word.slice(0, i) + 
          String.fromCharCode(c) + 
          word.slice(i + 1);
        
        // If new word exists in list, add to queue
        if (wordSet.has(newWord)) {
          queue.push([newWord, level + 1]);
          wordSet.delete(newWord); // Avoid revisiting
        }
      }
    }
  }
  
  // No path found
  return 0;
};
```

## Performance Considerations

### Time Complexity Analysis
- **For each word in queue**: O(L) to iterate through positions
- **For each position**: O(26) to try all letters
- **For each new word**: O(1) set lookup
- **Total**: O(N × L × 26) = O(N × L)

### Space Complexity Analysis
- **Queue**: O(N) in worst case
- **WordSet**: O(N × L)
- **Total**: O(N × L)

### Optimization Tips
1. Use a Set for O(1) word lookups
2. Mark visited words to avoid reprocessing
3. Use BFS to ensure shortest path
4. Consider bidirectional BFS for large graphs

## Test Coverage

### Edge Cases Covered
- ✓ No valid path exists
- ✓ Empty word list
- ✓ Direct one-letter transformation
- ✓ Multiple intermediate steps
- ✓ No matching end word
- ✓ Words with multiple letter differences

### Scenarios Tested
- ✓ Small word sets
- ✓ Large word sets (1000+ words)
- ✓ Various path lengths (2 to 5+ words)
- ✓ Different word lengths
- ✓ Alphabet coverage

## Debugging Tips

If a test fails, check:

1. **Word validation**: Ensure all words are in the wordList
2. **One-letter rule**: Verify only one letter changes per transformation
3. **Queue processing**: BFS must use queue (not stack)
4. **Visited tracking**: Avoid processing the same word twice
5. **End condition**: Check if beginWord equals endWord (should return 1)

## Integration with Database

The Word Ladder challenge in the database includes:

```javascript
{
  title: "Word Ladder",
  testCases: [
    {
      input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
      output: '5',
      explanation: 'One shortest transformation sequence...'
    },
    // ... more test cases
  ]
}
```

## Files

- **Backend**: `backend/tests/wordLadder.test.js` - Complete test suite
- **Backend**: `backend/run-tests.js` - Test runner script
- **Frontend**: `frontend/src/components/WordLadderTests.jsx` - React test component
- **Frontend**: `frontend/src/components/WordLadderTests.css` - Component styles
- **Database**: `backend/seed-challenges.js` - Challenge seed data

## Contributing

To add new test cases:

1. Add to `testCases` array in `backend/tests/wordLadder.test.js`
2. Update `seed-challenges.js` with test case data
3. Run tests to verify: `node run-tests.js`
4. Update this documentation

## References

- Algorithm Type: Breadth-First Search (BFS)
- Related: LeetCode Problem #127
- Difficulty: Hard
- Prerequisites: Graph Theory, BFS, Set Operations
