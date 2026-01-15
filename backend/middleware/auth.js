import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized to access this route' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error in authentication middleware' });
  }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Optional middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
      } catch (error) {
        // Token invalid but don't fail
        req.user = null;
      }
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export { protect, authorize, optionalAuth };
