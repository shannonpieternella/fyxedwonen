const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth middleware - verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user (support both 'id' and 'userId' for backwards compatibility)
    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request
    req.user = { id: user._id.toString(), email: user.email };
    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { authMiddleware };
