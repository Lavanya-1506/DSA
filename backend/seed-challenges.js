import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from './models/Challenge.js';

dotenv.config();

const seedChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    const challenges = [
      {
        title: 'Two Sum',
        description: 'Find two numbers that add up to a target sum.',
        category: 'Sorting',
        difficulty: 'Easy',
        problemStatement:
          'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
        exampleInput: 'nums = [2, 7, 11, 15], target = 9',
        exampleOutput: '[0, 1]',
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
        hints: ['Use a hash map'],
        solutionCode:
          'const map = new Map(); for(let i=0; i<nums.length; i++) { if(map.has(target-nums[i])) return [map.get(target-nums[i]), i]; map.set(nums[i], i); }',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        testCases: [
          { input: '[[2,7,11,15],9]', output: '[0,1]', explanation: '2 + 7 = 9' },
          { input: '[[3,2,4],6]', output: '[1,2]', explanation: '2 + 4 = 6' },
          { input: '[[3,3],6]', output: '[0,1]', explanation: '3 + 3 = 6' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Reverse String',
        description: 'Reverse a string',
        category: 'Searching',
        difficulty: 'Easy',
        problemStatement: 'Reverse a string',
        exampleInput: 's = "hello"',
        exampleOutput: '"olleh"',
        constraints: [],
        hints: [],
        solutionCode: 'return s.split("").reverse().join("");',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        testCases: [
          { input: '["hello"]', output: '"olleh"', explanation: 'Simple lowercase word' },
          { input: '["abcd"]', output: '"dcba"', explanation: 'Even length string' },
          { input: '["a"]', output: '"a"', explanation: 'Single character string' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Binary Tree Level Order',
        description: 'Level order traversal',
        category: 'Trees',
        difficulty: 'Medium',
        problemStatement: 'Level order traversal',
        exampleInput: 'root = [3,9,20]',
        exampleOutput: '[[3],[9,20]]',
        constraints: [],
        hints: [],
        solutionCode:
          'const queue = [root]; const res = []; while(queue.length) { const size = queue.length; const level = []; for(let i=0; i<size; i++) { const node = queue.shift(); level.push(node.val); if(node.left) queue.push(node.left); if(node.right) queue.push(node.right); } res.push(level); } return res;',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(w)',
        testCases: [
          {
            input: '[[3,9,20,null,null,15,7]]',
            output: '[[3],[9,20],[15,7]]',
            explanation: 'Classic level-order example',
          },
          { input: '[[1]]', output: '[[1]]', explanation: 'Single node tree' },
          { input: '[[]]', output: '[]', explanation: 'Empty tree' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Longest Substring',
        description: 'Longest substring without repeat',
        category: 'Searching',
        difficulty: 'Medium',
        problemStatement: 'Longest substring without repeating characters',
        exampleInput: 's = "abcabcbb"',
        exampleOutput: '3',
        constraints: [],
        hints: [],
        solutionCode:
          'const map = new Map(); let left = 0, maxLen = 0; for(let right = 0; right < s.length; right++) { if(map.has(s[right])) left = Math.max(left, map.get(s[right]) + 1); map.set(s[right], right); maxLen = Math.max(maxLen, right - left + 1); } return maxLen;',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        testCases: [
          { input: '["abcabcbb"]', output: '3', explanation: '"abc" is longest' },
          { input: '["bbbbb"]', output: '1', explanation: 'Only one unique character' },
          { input: '["pwwkew"]', output: '3', explanation: '"wke" is longest' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Merge K Sorted Lists',
        description: 'Merge multiple sorted lists',
        category: 'Graphs',
        difficulty: 'Hard',
        problemStatement: 'Merge K sorted lists',
        exampleInput: 'lists = [[1,4,5],[1,3,4]]',
        exampleOutput: '[1,1,3,4,4,5]',
        constraints: [],
        hints: [],
        solutionCode: 'return merge(lists, 0, lists.length - 1);',
        timeComplexity: 'O(n*log(k))',
        spaceComplexity: 'O(log(k))',
        testCases: [
          {
            input: '[[[1,4,5],[1,3,4],[2,6]]]',
            output: '[1,1,2,3,4,4,5,6]',
            explanation: 'Three sorted lists merged',
          },
          { input: '[[[]]]', output: '[]', explanation: 'Single empty list' },
          { input: '[[[1],[0]]]', output: '[0,1]', explanation: 'Two single-element lists' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Search Rotated Array',
        description: 'Search in rotated sorted array',
        category: 'Searching',
        difficulty: 'Medium',
        problemStatement: 'Search in rotated sorted array',
        exampleInput: 'nums = [4,5,6,7,0,1,2], target = 0',
        exampleOutput: '4',
        constraints: [],
        hints: [],
        solutionCode:
          'let left = 0, right = nums.length - 1; while(left <= right) { const mid = Math.floor((left + right) / 2); if(nums[mid] === target) return mid; if(nums[left] <= nums[mid]) { if(nums[left] <= target && target < nums[mid]) right = mid - 1; else left = mid + 1; } else { if(nums[mid] < target && target <= nums[right]) left = mid + 1; else right = mid - 1; } } return -1;',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)',
        testCases: [
          { input: '[[4,5,6,7,0,1,2],0]', output: '4', explanation: 'Target found at index 4' },
          { input: '[[4,5,6,7,0,1,2],3]', output: '-1', explanation: 'Target absent' },
          { input: '[[1],0]', output: '-1', explanation: 'Single element not equal target' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Valid Parentheses',
        description: 'Check valid parentheses',
        category: 'Stack & Queue',
        difficulty: 'Easy',
        problemStatement: 'Check valid parentheses',
        exampleInput: 's = "()"',
        exampleOutput: 'true',
        constraints: [],
        hints: [],
        solutionCode:
          'const stack = []; const pairs = {")" : "(", "}" : "{", "]" : "["}; for(let c of s) { if(pairs[c]) { if(stack.pop() !== pairs[c]) return false; } else { stack.push(c); } } return stack.length === 0;',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        testCases: [
          { input: '["()"]', output: 'true', explanation: 'Simple valid pair' },
          { input: '["()[]{}"]', output: 'true', explanation: 'Multiple valid brackets' },
          { input: '["(]"]', output: 'false', explanation: 'Mismatched pair' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Course Schedule',
        description: 'Determine if can finish courses',
        category: 'Graphs',
        difficulty: 'Medium',
        problemStatement: 'Can finish all courses with prerequisites',
        exampleInput: 'numCourses = 2, prerequisites = [[1,0]]',
        exampleOutput: 'true',
        constraints: [],
        hints: [],
        solutionCode:
          'const adj = Array(numCourses).fill(0).map(() => []); const indeg = Array(numCourses).fill(0); for(const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; } const q = []; for(let i = 0; i < numCourses; i++) if(indeg[i] === 0) q.push(i); let cnt = 0; while(q.length) { const u = q.shift(); cnt++; for(const v of adj[u]) if(--indeg[v] === 0) q.push(v); } return cnt === numCourses;',
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V + E)',
        testCases: [
          { input: '[2,[[1,0]]]', output: 'true', explanation: 'No cycle, all courses finishable' },
          { input: '[2,[[1,0],[0,1]]]', output: 'false', explanation: 'Cycle exists' },
          { input: '[3,[[1,0],[2,1]]]', output: 'true', explanation: 'Linear prerequisite chain' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Median Two Arrays',
        description: 'Find median of two sorted arrays',
        category: 'Sorting',
        difficulty: 'Hard',
        problemStatement: 'Median of two sorted arrays',
        exampleInput: 'nums1 = [1,3], nums2 = [2]',
        exampleOutput: '2.0',
        constraints: [],
        hints: [],
        solutionCode:
          'if(nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1); let low = 0, high = nums1.length; while(low <= high) { const cut1 = Math.floor((low + high) / 2); const cut2 = Math.floor((nums1.length + nums2.length + 1) / 2) - cut1; const left1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1]; const right1 = cut1 === nums1.length ? Infinity : nums1[cut1]; const left2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1]; const right2 = cut2 === nums2.length ? Infinity : nums2[cut2]; if(left1 <= right2 && left2 <= right1) return (nums1.length + nums2.length) % 2 === 0 ? (Math.max(left1, left2) + Math.min(right1, right2)) / 2 : Math.max(left1, left2); else if(left1 > right2) high = cut1 - 1; else low = cut1 + 1; } return -1;',
        timeComplexity: 'O(log(min(m,n)))',
        spaceComplexity: 'O(1)',
        testCases: [
          { input: '[[1,3],[2]]', output: '2.0', explanation: 'Median of [1,2,3]' },
          { input: '[[1,2],[3,4]]', output: '2.5', explanation: 'Median of [1,2,3,4]' },
          { input: '[[],[1]]', output: '1.0', explanation: 'Single element from second array' },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
      {
        title: 'Word Ladder',
        description: 'Shortest word transformation',
        category: 'Graphs',
        difficulty: 'Hard',
        problemStatement:
          'Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
        exampleInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        exampleOutput: '5',
        constraints: [
          '1 <= beginWord.length <= 10',
          'endWord.length == beginWord.length',
          '1 <= wordList.length <= 5000',
          'wordList[i].length == beginWord.length',
          'beginWord, endWord, and wordList[i] consist of lowercase English letters',
          'beginWord != endWord',
          'All words in wordList are unique',
        ],
        hints: [
          'Use BFS to find the shortest path',
          'Consider creating a graph where edges connect words differing by one letter',
          'Use a set for O(1) lookup of words',
        ],
        solutionCode:
          'const wordLadder = (beginWord, endWord, wordList) => { const wordSet = new Set(wordList); if(!wordSet.has(endWord)) return 0; const queue = [[beginWord, 1]]; while(queue.length) { const [word, level] = queue.shift(); if(word === endWord) return level; for(let i = 0; i < word.length; i++) { for(let c = 97; c <= 122; c++) { const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1); if(wordSet.has(newWord)) { queue.push([newWord, level + 1]); wordSet.delete(newWord); } } } } return 0; };',
        timeComplexity: 'O(N*L*26)',
        spaceComplexity: 'O(N*L)',
        testCases: [
          {
            input: '["hit","cog",["hot","dot","dog","lot","log","cog"]]',
            output: '5',
            explanation: 'hit -> hot -> dot -> dog -> cog',
          },
          {
            input: '["hit","cog",["hot","dot","dog","lot","log"]]',
            output: '0',
            explanation: 'No endWord in list',
          },
          {
            input: '["a","c",["a","b","c"]]',
            output: '2',
            explanation: 'a -> c',
          },
        ],
        stats: { totalAttempts: 0, totalSolutions: 0, acceptanceRate: 0, averageTime: 0 },
      },
    ];

    const insertedChallenges = await Challenge.insertMany(challenges);
    console.log(`Successfully seeded ${insertedChallenges.length} challenges`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding challenges:', error);
    process.exit(1);
  }
};

seedChallenges();
