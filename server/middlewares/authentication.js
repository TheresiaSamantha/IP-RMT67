const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

class Unathorized extends Error {
  constructor(message) {
    super();
    this.name = "UnathorizedError";
    this.message = message;
  }
}

module.exports = async function authentication(req, res, next) {
  const bearerToken = req.headers.authorization;
  // console.log(bearerToken, "Tidak ada token");
  if (!bearerToken) {
    next(new Unathorized("Invalid token"));
    return;
  }
  const token = bearerToken.split(" ")[1];

  try {
    //*verify access token nya
    const data = verifyToken(token);

    //*Kita cek ke db apakah user tersebut masih ada atau tidak
    const user = await User.findByPk(data.id);
    if (!user) {
      next(new Unathorized("Invalid token"));
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      next(new Unathorized("Invalid token"));
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
