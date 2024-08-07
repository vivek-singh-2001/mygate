const jwt = require("jsonwebtoken");

const signToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: '1d',    
  });
};

module.exports = signToken;