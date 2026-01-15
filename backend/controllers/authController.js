import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register User
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all required fields' });
    }

    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already in use' });
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: user.toJSON(),
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error in registration',
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user (include password field for comparison)
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: user.toJSON(),
      message: 'Logged in successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error in login',
    });
  }
};

// Get Current User Profile
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, githubProfile, linkedinProfile, country, profileImage } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (githubProfile !== undefined) updateData.githubProfile = githubProfile;
    if (linkedinProfile !== undefined) updateData.linkedinProfile = linkedinProfile;
    if (country !== undefined) updateData.country = country;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    updateData.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all password fields' });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Get user with password field
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete User Account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide your password' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Password is incorrect' });
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout (Frontend will remove token)
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export { register, login, getMe, updateProfile, changePassword, getUserById, getAllUsers, deleteAccount, logout };
