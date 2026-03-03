#!/usr/bin/env node

// Test runner for DSA Algorithms
// Usage: node run-tests.js [algorithm]
// Examples: node run-tests.js wordladder | node run-tests.js median | node run-tests.js all

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const algorithm = process.argv[2] || 'all';

// Main test execution
async function main() {
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║         DSA ALGORITHM TEST RUNNER        ║');
  console.log('╚═══════════════════════════════════════════╝\n');

  try {
    // Run Word Ladder tests
    if (algorithm === 'wordladder' || algorithm === 'all') {
      console.log('\n>>> Running Word Ladder Tests...\n');
      const wordLadderModule = await import('./tests/wordLadder.test.js');
      const { runTests: runWordLadderTests } = wordLadderModule;
      runWordLadderTests();
    }

    // Run Median Two Arrays tests
    if (algorithm === 'median' || algorithm === 'all') {
      console.log('\n>>> Running Median of Two Sorted Arrays Tests...\n');
      const medianModule = await import('./tests/medianTwoArrays.test.js');
      const { runTests: runMedianTests } = medianModule;
      runMedianTests();
    }

    console.log('\n✅ All tests completed!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
