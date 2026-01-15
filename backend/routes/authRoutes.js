import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  getUserById,
  getAllUsers,
  deleteAccount,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);
router.post('/logout', protect, logout);

// User routes
router.get('/user/:id', getUserById);

// Admin routes
router.get('/all-users', protect, authorize('admin'), getAllUsers);

export default router;
