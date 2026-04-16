const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('🔐 Auth middleware - Token check:', token ? '✓ Token found' : '✗ No token');

  if (!token) {
    console.log('✗ No token provided');
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✓ Token verified:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('✗ Token verification failed:', error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied - insufficient permissions" });
    }
    next();
  };
};