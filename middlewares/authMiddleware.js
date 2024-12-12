const jwt = require('jsonwebtoken');
const secret = 'e8a639e1f44f0585beacfcc401d2bab78853cf00e4e093b8d218eacf532d201a31a65b9036f385cdac21269be06612724e0b9d2b600eac877f49a54ca6653e46';

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
