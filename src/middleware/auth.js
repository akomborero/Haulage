const jwt = require('jsonwebtoken');

// 1.  the protect function
const protect = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

// 2. the authorize function
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role (from the token) is in the allowed list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access Denied: ${req.user.role}s cannot perform this action.` 
      });
    }
    next();
  };
};

// 3. Export them as an OBJECT
module.exports = { protect, authorize };