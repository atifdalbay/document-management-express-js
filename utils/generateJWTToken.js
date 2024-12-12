const jwt = require('jsonwebtoken');
const jwtSecret = "e8a639e1f44f0585beacfcc401d2bab78853cf00e4e093b8d218eacf532d201a31a65b9036f385cdac21269be06612724e0b9d2b600eac877f49a54ca6653e46";
const jwtExpire = "1800s";

const generateJWTToken = (id, role) => {
  return jwt.sign({ id, role }, jwtSecret, { expiresIn: jwtExpire });
};

module.exports = generateJWTToken;
