import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't include password by default in queries
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    githubProfile: {
      type: String,
      default: null,
    },
    linkedinProfile: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    stats: {
      totalProblemsAttempted: {
        type: Number,
        default: 0,
      },
      totalProblemsSolved: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastActivityDate: {
        type: Date,
        default: null,
      },
    },
    algorithmsCompleted: [
      {
        algorithmName: String,
        category: String,
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    bookmarkedAlgorithms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Algorithm',
      },
    ],
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update streak
userSchema.methods.updateStreak = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = this.stats.lastActivityDate
    ? new Date(this.stats.lastActivityDate)
    : null;

  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      this.stats.currentStreak += 1;
      if (this.stats.currentStreak > this.stats.longestStreak) {
        this.stats.longestStreak = this.stats.currentStreak;
      }
    } else if (daysDiff > 1) {
      this.stats.currentStreak = 1;
    }
  } else {
    this.stats.currentStreak = 1;
  }

  this.stats.lastActivityDate = new Date();
  await this.save();
};

// Hide sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationToken;
  return obj;
};

export default mongoose.model('User', userSchema);
