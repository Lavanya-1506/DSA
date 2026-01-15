import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a challenge title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    category: {
      type: String,
      enum: ['Sorting', 'Searching', 'Trees', 'Graphs', 'Stack & Queue', 'Dynamic Programming'],
      required: true,
    },
    problemStatement: {
      type: String,
      required: true,
    },
    exampleInput: {
      type: String,
      required: true,
    },
    exampleOutput: {
      type: String,
      required: true,
    },
    constraints: [String],
    hints: [String],
    solutionCode: {
      type: String,
      required: true,
    },
    timeComplexity: {
      type: String,
      required: true,
    },
    spaceComplexity: {
      type: String,
      required: true,
    },
    testCases: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
      },
    ],
    stats: {
      totalAttempts: {
        type: Number,
        default: 0,
      },
      totalSolutions: {
        type: Number,
        default: 0,
      },
      acceptanceRate: {
        type: Number,
        default: 0,
      },
      averageTime: {
        type: Number,
        default: 0,
      },
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Update stats on save
challengeSchema.pre('save', function (next) {
  if (this.testCases && this.testCases.length > 0) {
    this.updatedAt = new Date();
  }
  next();
});

export default mongoose.model('Challenge', challengeSchema);
