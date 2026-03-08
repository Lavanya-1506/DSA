**DSA Insight – Interactive Data Structures & Algorithms Learning Platform**

DSA Insight is a web-based learning platform developed during the hackathon to help students understand Data Structures and Algorithms (DSA) in a more interactive and visual way. Many learners find DSA difficult because they cannot see how algorithms work internally. Our platform solves this problem by providing step-by-step visualizations, practice challenges, and a competitive leaderboard system.

The platform allows users to explore and understand different data structures and algorithms through real-time visual simulations, making complex concepts easier to grasp.

**Key Features**
1. User Authentication

The platform includes a secure login and registration system that allows users to create accounts and access the learning modules. Authentication also helps maintain user scores and leaderboard rankings.

2. Algorithm Visualizer

DSA Insight provides an interactive algorithm visualizer that demonstrates how algorithms work internally. Users can observe the algorithm execution step-by-step, helping them understand the logic behind each operation.

The visualizer includes:

Stack – Push and Pop operations following the LIFO principle

Queue – Enqueue and Dequeue operations following the FIFO principle

Sorting Algorithms – Visual representation of how elements are compared and swapped during sorting

Searching Algorithms – Demonstrates how algorithms find elements in a dataset

Tree Algorithms – Visualization of hierarchical node structures and traversals

Graph Algorithms – Visual display of nodes and edges with traversal concepts

3. Interactive DSA Challenges

The platform includes practice challenges where users can solve DSA-related problems to test their understanding and improve their problem-solving skills.

4. Leaderboard System

A leaderboard feature ranks users based on their challenge performance and scores. This adds a competitive learning element and encourages users to improve their skills.

5. Educational Insights

Each algorithm module includes basic explanations and algorithm information, helping users understand both the theoretical concepts and practical implementation.

6. Step-by-Step Visualization

Algorithms are broken down into individual execution steps, allowing users to observe how the data structure changes during each step of the algorithm.

**Objective of the Project**
The objective of DSA Insight is to make learning Data Structures and Algorithms more engaging, interactive, and easier to understand. By combining visualization, practice challenges, and a competitive leaderboard, the platform helps learners build stronger algorithmic thinking and problem-solving skills.

**Tech Stack used in this Project**
**Backend**
Runtime: Node.js (using ES modules)
Framework: Express.js (for building the REST API)
Database: MongoDB (with Mongoose as the ODM for data modeling)
Authentication: JSON Web Tokens (jsonwebtoken) with bcryptjs for password hashing
Other Libraries:
CORS handling (cors)
Environment variables (dotenv)
HTTP requests (node-fetch)
Development Tools:
Nodemon (for auto-restarting during development)

**Frontend**
Framework: React 19.1.1 (with React DOM for rendering)
Build Tool: Vite (using rolldown-vite for bundling)
Styling: Tailwind CSS (integrated via @tailwindcss/vite plugin)
Routing: React Router DOM
Development Tools:
ESLint (for code linting, with React-specific plugins)
TypeScript types (@types/react and @types/react-dom, though the codebase uses .jsx files)
