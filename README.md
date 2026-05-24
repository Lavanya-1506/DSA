<<<<<<< HEAD
# DSA Simulator 🧮

An interactive web application for learning and practicing Data Structures and Algorithms (DSA) through visual simulations and coding challenges.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Core Functionality
- **Interactive Algorithm Visualizations**: Step-by-step animations for sorting, searching, tree operations, and graph algorithms
- **Coding Challenges**: Practice problems with difficulty levels (Easy, Medium, Hard)
- **Code Execution**: Run and test code solutions with real-time feedback
- **Progress Tracking**: Monitor your learning progress and solved challenges
- **Leaderboard**: Compete with other users and track rankings

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication
- Profile management
- Password change functionality
- Protected routes for authenticated users

### 📊 Algorithm Categories
- **Sorting Algorithms**: Bubble Sort, Quick Sort, Merge Sort, Insertion Sort, Selection Sort
- **Searching Algorithms**: Linear Search, Binary Search
- **Tree Structures**: Binary Trees, Binary Search Trees (BST), Tree traversals
- **Graph Algorithms**: BFS, DFS, Pathfinding
- **Stack & Queue**: LIFO/FIFO operations with visualizations

### 🏆 Challenge System
- Categorized challenges by difficulty and topic
- Real-time code execution and testing
- Submission history and statistics
- Acceptance rate tracking
- Detailed leaderboard with rankings

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **Code Execution**: Piston API for running user code
- **Middleware**: CORS, dotenv
- **Development**: Nodemon

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite (with Rolldown)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **State Management**: React Context API
- **Linting**: ESLint

### Additional Tools
- **Version Control**: Git
- **Package Management**: npm
- **API Testing**: REST Client
- **Code Execution**: External Piston API

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lavanya-1506/DSA.git
   cd DSA
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Seed the database** (optional - adds sample challenges)
   ```bash
   cd backend
   node seed-challenges.js
   ```

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/dsa_simulator

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Code Execution API
PISTON_API_URL=https://emkc.org/api/v2/piston/execute
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5000`

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend linting:
```bash
cd frontend
npm run lint
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |
| DELETE | `/api/auth/account` | Delete account | Yes |

### Challenge Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/challenges` | Get all challenges | No |
| GET | `/api/challenges/:id` | Get specific challenge | No |
| GET | `/api/challenges/difficulty/:difficulty` | Get challenges by difficulty | No |
| GET | `/api/challenges/category/:category` | Get challenges by category | No |
| POST | `/api/challenges` | Create challenge | Yes (Admin) |
| PUT | `/api/challenges/:id` | Update challenge | Yes (Admin) |
| DELETE | `/api/challenges/:id` | Delete challenge | Yes (Admin) |

### Submission Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/submissions/run` | Run code (testing) | No |
| POST | `/api/submissions` | Submit solution | Yes |
| GET | `/api/submissions/user` | Get user submissions | Yes |
| GET | `/api/submissions/user/progress` | Get user progress | Yes |
| GET | `/api/submissions/:id` | Get specific submission | Yes |
| GET | `/api/submissions/challenge/:challengeId` | Get challenge submissions | No |

### Leaderboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/leaderboard` | Get basic leaderboard | No |
| GET | `/api/leaderboard/detailed` | Get detailed leaderboard | No |
| GET | `/api/leaderboard/user-ranking` | Get user ranking | Yes |

## 📁 Project Structure

```
DSA/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── challengeController.js # Challenge management
│   │   └── submissionController.js # Code execution & submissions
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Challenge.js         # Challenge schema
│   │   └── Submission.js        # Submission schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   └── challengeRoutes.js   # Challenge & submission routes
│   ├── tests/                   # Test files
│   ├── seed-challenges.js       # Database seeding script
│   ├── server.js                # Express server setup
│   └── package.json
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page components
│   │   │   ├── Auth/            # Login/Register pages
│   │   │   ├── Challenges/      # Challenge related pages
│   │   │   ├── Home/            # Home page
│   │   │   └── ...              # Algorithm visualization pages
│   │   ├── routes/              # Routing configuration
│   │   ├── styles/              # Global styles
│   │   ├── utils/               # Utility functions & API calls
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # App entry point
│   ├── package.json
│   ├── vite.config.js           # Vite configuration
│   └── eslint.config.js         # ESLint configuration
└── README.md                    # Project documentation
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for learning and practice
- Special thanks to the open-source community
- Algorithm visualizations inspired by various educational resources

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Happy Coding! 🚀**
=======
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

-Runtime: Node.js (using ES modules)

-Framework: Express.js (for building the REST API)

-Database: MongoDB (with Mongoose as the ODM for data modeling)

-Authentication: JSON Web Tokens (jsonwebtoken) with bcryptjs for password hashing

Other Libraries:

-CORS handling (cors)

-Environment variables (dotenv)

-HTTP requests (node-fetch)

-Development Tools:

-Nodemon (for auto-restarting during development)


**Frontend**

-Framework: React 19.1.1 (with React DOM for rendering)

-Build Tool: Vite (using rolldown-vite for bundling)

-Styling: Tailwind CSS (integrated via @tailwindcss/vite plugin)

-Routing: React Router DOM

-Development Tools:

-ESLint (for code linting, with React-specific plugins)

-TypeScript types (@types/react and @types/react-dom, though the codebase uses .jsx files)

>>>>>>> 3aa68444b707ff03341ed0c34acf07c2e886380f
