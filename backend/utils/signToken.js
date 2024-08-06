const jwt = require("jsonwebtoken");

const signToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN  *60,    
  });
};

module.exports = signToken;0