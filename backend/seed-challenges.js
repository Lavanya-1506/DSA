// Backend seed script to populate initial challenges
// Run this with: node seed-challenges.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from './models/Challenge.js';

dotenv.config();

const seedChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    const challenges = [
      {
        title: 'Two Sum',
        description:
          'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
        category: 'Arrays',
        difficulty: 'Easy',
        examples: [
          {
            input: { nums: [2, 7, 11, 15], target: 9 },
            output: [0, 1],
            explanation: 'nums[0] + nums[1] == 9, return [0, 1]',
          },
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
        ],
        hints: ['Use a hash map to store values you have seen'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Reverse String',
        description:
          'Write a function that reverses a string. The input string is given as an array of characters s.',
        category: 'Strings',
        difficulty: 'Easy',
        examples: [
          {
            input: { s: ['h', 'e', 'l', 'l', 'o'] },
            output: ['o', 'l', 'l', 'e', 'h'],
          },
        ],
        constraints: [
          '1 <= s.length <= 10^5',
          "s[i] is a printable ascii character.",
        ],
        hints: ['Two pointer approach might be useful'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Binary Tree Level Order Traversal',
        description:
          'Given the root of a binary tree, return the level order traversal of its nodes values.',
        category: 'Trees',
        difficulty: 'Medium',
        examples: [
          {
            input: { root: '[3,9,20,null,null,15,7]' },
            output: '[[3],[9,20],[15,7]]',
          },
        ],
        constraints: [
          'The number of nodes in the tree is in the range [0, 2000]',
          '-1000 <= Node.val <= 1000',
        ],
        hints: ['Use a queue to implement BFS', 'Track level information'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        description:
          'Given a string s, find the length of the longest substring without repeating characters.',
        category: 'Strings',
        difficulty: 'Medium',
        examples: [
          {
            input: { s: 'abcabcbb' },
            output: 3,
            explanation: 'The answer is "abc"',
          },
        ],
        constraints: [
          '0 <= s.length <= 5 * 10^4',
          's consists of English letters, digits, symbols and spaces.',
        ],
        hints: ['Sliding window approach', 'Use a hash map to track characters'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Merge K Sorted Lists',
        description:
          'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
        category: 'Linked Lists',
        difficulty: 'Hard',
        examples: [
          {
            input: { lists: '[[1,4,5],[1,3,4],[2,6]]' },
            output: '[1,1,2,1,3,4,4,5,6]',
          },
        ],
        constraints: [
          'k == lists.length',
          '0 <= k <= 10^4',
          '0 <= lists[i].length <= 500',
          '-10^4 <= lists[i][j] <= 10^4',
        ],
        hints: [
          'Use a min heap to efficiently get the smallest element',
          'Or use merge sort approach',
        ],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Search in Rotated Sorted Array',
        description:
          'There is an integer array nums sorted in ascending order (with distinct values). Given the rotated array and an integer target.',
        category: 'Searching',
        difficulty: 'Medium',
        examples: [
          {
            input: { nums: '[4,5,6,7,0,1,2]', target: 0 },
            output: 4,
          },
        ],
        constraints: [
          '1 <= nums.length <= 5000',
          '-10^4 <= nums[i] <= 10^4',
          'All values of nums are unique.',
        ],
        hints: ['Binary search can solve this in O(log n)', 'Identify which half is sorted'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Valid Parentheses',
        description:
          'Given a string s containing just the characters "(" , ")" , "{" , "}" , "[" and "]" , determine if the input string is valid.',
        category: 'Stacks',
        difficulty: 'Easy',
        examples: [
          {
            input: { s: '()' },
            output: true,
          },
        ],
        constraints: [
          '1 <= s.length <= 10^4',
          "s consists of parentheses only '()[]{}' .",
        ],
        hints: ['Use a stack to track opening brackets', 'Closing brackets should match the most recent opening bracket'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Course Schedule',
        description:
          'There are a total of numCourses courses you have to take. You are given an array prerequisites.',
        category: 'Graphs',
        difficulty: 'Medium',
        examples: [
          {
            input: { numCourses: 2, prerequisites: '[[1,0]]' },
            output: true,
          },
        ],
        constraints: [
          '1 <= numCourses <= 2000',
          '0 <= prerequisites.length <= 5000',
        ],
        hints: ['Detect cycle using DFS or BFS', 'Topological sort approach'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Median of Two Sorted Arrays',
        description:
          'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        category: 'Arrays',
        difficulty: 'Hard',
        examples: [
          {
            input: { nums1: '[1,3]', nums2: '[2]' },
            output: 2.0,
          },
        ],
        constraints: [
          'nums1.length == m',
          'nums2.length == n',
          '0 <= m <= 1000',
          '0 <= n <= 1000',
        ],
        hints: ['Binary search approach', 'Partition the arrays correctly'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
      },
      {
        title: 'Word Ladder',
        description:
          'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words.',
        category: 'Graphs',
        difficulty: 'Hard',
        examples: [
          {
            input: {
              beginWord: 'hit',
              endWord: 'cog',
              wordList: '["hot","dot","dog","lot","log","cog"]',
            },
            output: 5,
          },
        ],
        constraints: [
          '1 <= beginWord.length <= 10',
          '1 <= wordList.length <= 5000',
        ],
        hints: ['BFS to find shortest path', 'Build a graph of valid transformations'],
        stats: {
          totalAttempts: 0,
          totalSolutions: 0,
          acceptanceRate: 0,
        },
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
