import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['JavaScript', 'Python', 'Java', 'C++'],
      default: 'JavaScript',
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error'],
      default: 'Wrong Answer',
    },
    testsPassed: {
      type: Number,
      default: 0,
    },
    totalTests: {
      type: Number,
      default: 0,
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    testResults: [
      {
        testCase: Number,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
      },
    ],
    submittedAt: {
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

// Index for faster queries
submissionSchema.index({ userId: 1, challengeId: 1 });
submissionSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Submission', submissionSchema);
