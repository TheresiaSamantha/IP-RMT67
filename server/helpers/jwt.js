const jwt = require("jsonwebtoken");

module.exports = {
  signToken: (input) => {
    return jwt.sign(input, process.env.JWT_CODE);
  },
  verifyToken: (input) => {
    return jwt.verify(input, process.env.JWT_CODE);
  },
};
