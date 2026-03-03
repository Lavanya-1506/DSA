// Test cases for Word Ladder Problem
// Location: backend/tests/wordLadder.test.js

// Word Ladder Solution
const wordLadderSolution = (beginWord, endWord, wordList) => {
  const wordSet = new Set(wordList);
  
  if (!wordSet.has(endWord)) return 0;
  
  const queue = [[beginWord, 1]];
  
  while (queue.length) {
    const [word, level] = queue.shift();
    
    if (word === endWord) return level;
    
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) { // 'a' to 'z'
        const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
        
        if (wordSet.has(newWord)) {
          queue.push([newWord, level + 1]);
          wordSet.delete(newWord);
        }
      }
    }
  }
  
  return 0;
};

// Test Cases
const testCases = [
  // Basic case from example
  {
    id: 1,
    beginWord: "hit",
    endWord: "cog",
    wordList: ["hot", "dot", "dog", "lot", "log", "cog"],
    expected: 5,
    description: "Example case: hit -> hot -> dot -> dog -> cog",
    difficulty: "Medium"
  },

  // Simple case
  {
    id: 2,
    beginWord: "a",
    endWord: "c",
    wordList: ["a", "b", "c"],
    expected: 2,
    description: "Simple path: a -> c (via b)",
    difficulty: "Easy"
  },

  // No solution
  {
    id: 3,
    beginWord: "hit",
    endWord: "cog",
    wordList: ["hot", "dot", "dog", "lot", "log"],
    expected: 0,
    description: "No path exists - cog not reachable",
    difficulty: "Medium"
  },

  // Two words differ by one letter
  {
    id: 4,
    beginWord: "cat",
    endWord: "bat",
    wordList: ["bat"],
    expected: 2,
    description: "Direct transformation: cat -> bat",
    difficulty: "Easy"
  },

  // Longer path
  {
    id: 5,
    beginWord: "cold",
    endWord: "warm",
    wordList: ["cold", "cord", "card", "ward", "warm"],
    expected: 5,
    description: "Path: cold -> cord -> card -> ward -> warm",
    difficulty: "Hard"
  },

  // Single word in list (not the target)
  {
    id: 6,
    beginWord: "hot",
    endWord: "dog",
    wordList: ["hot"],
    expected: 0,
    description: "Only one word in list, can't reach target",
    difficulty: "Easy"
  },

  // Empty word list
  {
    id: 7,
    beginWord: "a",
    endWord: "b",
    wordList: [],
    expected: 0,
    description: "Empty word list",
    difficulty: "Easy"
  },

  // Begin word equals end word (should be 1)
  {
    id: 8,
    beginWord: "cat",
    endWord: "cat",
    wordList: ["cat"],
    expected: 1,
    description: "Start equals end",
    difficulty: "Easy"
  },

  // Multiple paths - should return shortest
  {
    id: 9,
    beginWord: "red",
    endWord: "tax",
    wordList: ["red", "ted", "tex", "tax"],
    expected: 4,
    description: "Path: red -> ted -> tex -> tax",
    difficulty: "Medium"
  },

  // Complex case with multiple options
  {
    id: 10,
    beginWord: "start",
    endWord: "end",
    wordList: ["start", "stert", "stent", "spend", "trend", "treat"],
    expected: 0,
    description: "Complex case - no valid path to end",
    difficulty: "Hard"
  },

  // Another example
  {
    id: 11,
    beginWord: "leet",
    endWord: "code",
    wordList: ["leet", "code"],
    expected: 0,
    description: "Words differ by more than one letter",
    difficulty: "Easy"
  },

  // Bidirectional search case
  {
    id: 12,
    beginWord: "hot",
    endWord: "dog",
    wordList: ["hot", "dot", "dog", "lot", "log"],
    expected: 5,
    description: "Path: hot -> dot -> dog (requires intermediate steps)",
    difficulty: "Medium"
  },

  // Single letter difference chain
  {
    id: 13,
    beginWord: "a",
    endWord: "m",
    wordList: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"],
    expected: 13,
    description: "Linear chain of single letter differences",
    difficulty: "Hard"
  },

  // No direct path but exists through intermediate words
  {
    id: 14,
    beginWord: "black",
    endWord: "white",
    wordList: ["black", "blank", "blank", "shank", "shale", "whale", "whale", "white"],
    expected: 0,
    description: "Complex word ladder - no valid path",
    difficulty: "Hard"
  },

  // Edge case - begin word not in list
  {
    id: 15,
    beginWord: "xyz",
    endWord: "abc",
    wordList: ["abc"],
    expected: 0,
    description: "Begin word not in list and can't reach end",
    difficulty: "Easy"
  }
];

// Test Runner
function runTests() {
  console.log("\n=== WORD LADDER TEST SUITE ===\n");
  
  let passedCount = 0;
  let failedCount = 0;
  const failedTests = [];
  
  testCases.forEach((test) => {
    const result = wordLadderSolution(test.beginWord, test.endWord, test.wordList);
    const passed = result === test.expected;
    
    if (passed) {
      passedCount++;
      console.log(`✓ Test ${test.id} PASSED: ${test.description}`);
    } else {
      failedCount++;
      console.log(`✗ Test ${test.id} FAILED: ${test.description}`);
      failedTests.push({
        id: test.id,
        description: test.description,
        expected: test.expected,
        got: result
      });
    }
  });
  
  // Summary
  console.log("\n=== TEST SUMMARY ===");
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Success Rate: ${((passedCount / testCases.length) * 100).toFixed(2)}%\n`);
  
  if (failedTests.length > 0) {
    console.log("Failed Tests Details:");
    failedTests.forEach((test) => {
      console.log(`  Test ${test.id}: ${test.description}`);
      console.log(`    Expected: ${test.expected}, Got: ${test.got}`);
    });
  }
  
  return failedCount === 0;
}

// Performance Test
function performanceTest() {
  console.log("\n=== PERFORMANCE TEST ===\n");
  
  // Large word list test
  const largeWordList = [];
  for (let i = 0; i < 1000; i++) {
    largeWordList.push(Math.random().toString(36).substring(2, 5));
  }
  
  const startTime = Date.now();
  const result = wordLadderSolution("abc", "xyz", largeWordList);
  const endTime = Date.now();
  
  console.log(`Large dataset (1000 words):`);
  console.log(`  Result: ${result}`);
  console.log(`  Time: ${endTime - startTime}ms\n`);
}

// Export for use in other modules
export { wordLadderSolution, testCases, runTests, performanceTest };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const allPassed = runTests();
  performanceTest();
  process.exit(allPassed ? 0 : 1);
}
