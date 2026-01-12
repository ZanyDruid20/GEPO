const jwt = require('jsonwebtoken');

// Middleware to verify JWT token from Authorization header or x-auth-token
function verifyJWT(req, res, next) {
  try {
    let token;

    // Check Authorization header first (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Fallback to x-auth-token header
      token = req.headers['x-auth-token'];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    
    // Attach userId to request
    req.userId = decoded.userId;
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Token verification failed', error: error.message });
  }
}

module.exports = { verifyJWT };
