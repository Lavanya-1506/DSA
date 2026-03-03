// Test cases for Median of Two Sorted Arrays Problem
// Location: backend/tests/medianTwoArrays.test.js

// Median of Two Sorted Arrays Solution
const findMedianSortedArrays = (num1, num2) => {
  // Handle empty arrays
  if (num1.length === 0 && num2.length === 0) return 0;

  // Ensure num1 is the smaller array for optimization
  if (num1.length > num2.length) {
    return findMedianSortedArrays(num2, num1);
  }

  let low = 0;
  let high = num1.length;
  const totalLength = num1.length + num2.length;
  const isEven = totalLength % 2 === 0;

  while (low <= high) {
    const cut1 = Math.floor((low + high) / 2);
    const cut2 = Math.floor(totalLength / 2) - cut1;

    const left1 = cut1 === 0 ? -Infinity : num1[cut1 - 1];
    const right1 = cut1 === num1.length ? Infinity : num1[cut1];
    const left2 = cut2 === 0 ? -Infinity : num2[cut2 - 1];
    const right2 = cut2 === num2.length ? Infinity : num2[cut2];

    if (left1 <= right2 && left2 <= right1) {
      if (isEven) {
        return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
      } else {
        return Math.min(right1, right2);
      }
    } else if (left1 > right2) {
      high = cut1 - 1;
    } else {
      low = cut1 + 1;
    }
  }

  return -1; // Should not reach here with valid input
};

// Test Cases
const testCases = [
  // Test 1: Basic example - even total length
  {
    id: 1,
    num1: [1, 3],
    num2: [2],
    expected: 2.0,
    description: "Basic example: [1,3] and [2] -> median is 2.0",
    difficulty: "Easy"
  },

  // Test 2: Basic example - odd total length
  {
    id: 2,
    num1: [1, 2],
    num2: [3, 4],
    expected: 2.5,
    description: "Combined arrays [1,2,3,4] -> median is 2.5",
    difficulty: "Easy"
  },

  // Test 3: One empty array
  {
    id: 3,
    num1: [],
    num2: [1],
    expected: 1.0,
    description: "One empty array: [] and [1] -> median is 1.0",
    difficulty: "Easy"
  },

  // Test 4: Both empty arrays
  {
    id: 4,
    num1: [],
    num2: [],
    expected: 0,
    description: "Both arrays empty",
    difficulty: "Easy"
  },

  // Test 5: First array larger
  {
    id: 5,
    num1: [2, 3, 4, 5],
    num2: [1],
    expected: 3.0,
    description: "First array larger: [2,3,4,5] and [1] -> median is 3.0",
    difficulty: "Medium"
  },

  // Test 6: Negative numbers
  {
    id: 6,
    num1: [-2, 0],
    num2: [1, 3],
    expected: 0.5,
    description: "Negative numbers: [-2,0] and [1,3] -> median is 0.5",
    difficulty: "Medium"
  },

  // Test 7: Large gap between arrays
  {
    id: 7,
    num1: [1, 2],
    num2: [10, 11, 12],
    expected: 10,
    description: "Large gap: [1,2] and [10,11,12] -> median is 10",
    difficulty: "Medium"
  },

  // Test 8: Duplicates
  {
    id: 8,
    num1: [1, 1, 1],
    num2: [1, 1],
    expected: 1.0,
    description: "Duplicates: [1,1,1] and [1,1] -> median is 1.0",
    difficulty: "Easy"
  },

  // Test 9: Single element each
  {
    id: 9,
    num1: [5],
    num2: [7],
    expected: 6.0,
    description: "Single elements: [5] and [7] -> median is 6.0",
    difficulty: "Easy"
  },

  // Test 10: First array empty, second large
  {
    id: 10,
    num1: [],
    num2: [1, 2, 3, 4, 5],
    expected: 3.0,
    description: "First empty: [] and [1,2,3,4,5] -> median is 3.0",
    difficulty: "Easy"
  },

  // Test 11: Interleaved arrays
  {
    id: 11,
    num1: [1, 3, 5],
    num2: [2, 4, 6],
    expected: 3.5,
    description: "Interleaved: [1,3,5] and [2,4,6] -> median is 3.5",
    difficulty: "Medium"
  },

  // Test 12: All negative numbers
  {
    id: 12,
    num1: [-5, -3, -1],
    num2: [-4, -2],
    expected: -3.0,
    description: "Negative numbers: [-5,-3,-1] and [-4,-2] -> median is -3.0",
    difficulty: "Medium"
  },

  // Test 13: Large arrays
  {
    id: 13,
    num1: [1, 2, 3, 4, 5],
    num2: [6, 7, 8, 9, 10],
    expected: 5.5,
    description: "Large arrays: [1,2,3,4,5] and [6,7,8,9,10] -> median is 5.5",
    difficulty: "Hard"
  },

  // Test 14: Zeros and positive
  {
    id: 14,
    num1: [0, 0],
    num2: [0, 0],
    expected: 0.0,
    description: "All zeros: [0,0] and [0,0] -> median is 0.0",
    difficulty: "Easy"
  },

  // Test 15: Very different sizes
  {
    id: 15,
    num1: [1],
    num2: [2, 3, 4, 5, 6, 7, 8, 9],
    expected: 5.0,
    description: "Very different sizes: [1] and [2-9] -> median is 5.0",
    difficulty: "Hard"
  }
];

// Test Runner Function
function runTests() {
  console.log("\n🧪 MEDIAN OF TWO SORTED ARRAYS - TEST SUITE");
  console.log("=".repeat(60));

  let passed = 0;
  let failed = 0;
  const results = [];

  testCases.forEach((testCase) => {
    const startTime = performance.now();
    try {
      const result = findMedianSortedArrays(testCase.num1, testCase.num2);
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(4);

      // Compare with tolerance for floating point
      const isCorrect =
        Math.abs(result - testCase.expected) < 0.0001 ||
        result === testCase.expected;

      if (isCorrect) {
        passed++;
        results.push({
          id: testCase.id,
          status: "✓ PASS",
          description: testCase.description,
          executionTime,
          difficulty: testCase.difficulty
        });
      } else {
        failed++;
        results.push({
          id: testCase.id,
          status: "✗ FAIL",
          description: testCase.description,
          expected: testCase.expected,
          got: result,
          executionTime,
          difficulty: testCase.difficulty
        });
      }
    } catch (error) {
      failed++;
      results.push({
        id: testCase.id,
        status: "✗ ERROR",
        description: testCase.description,
        error: error.message,
        difficulty: testCase.difficulty
      });
    }
  });

  // Print Results
  console.log("\n📊 TEST RESULTS:\n");
  results.forEach((result) => {
    console.log(`Test #${result.id} [${result.difficulty}] ${result.status}`);
    console.log(`  Description: ${result.description}`);
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    } else if (result.got !== undefined) {
      console.log(`  Expected: ${result.expected}, Got: ${result.got}`);
    }
    console.log(`  Time: ${result.executionTime}ms`);
    console.log();
  });

  // Summary
  console.log("=".repeat(60));
  console.log(`\n📈 SUMMARY:`);
  console.log(`  Total Tests: ${testCases.length}`);
  console.log(`  ✓ Passed: ${passed}`);
  console.log(`  ✗ Failed: ${failed}`);
  console.log(
    `  Success Rate: ${((passed / testCases.length) * 100).toFixed(2)}%`
  );
  console.log("\n");

  return {
    passed,
    failed,
    total: testCases.length,
    results
  };
}

// Export for use in other modules
export { findMedianSortedArrays, testCases, runTests };
