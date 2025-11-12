const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt.js");
const { signToken } = require("../helpers/jwt");

class ControllerUser {
  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      console.log("🚀 ~ ControllerUser ~ register ~ body:", user.password);
      res.status(201).json({
        message: "Add User Success",
        data: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      // check input
      if (!email) {
        throw {
          name: "BadRequest",
          message: "email is required",
        };
      }
      if (!password) {
        throw {
          name: "BadRequest",
          message: "password is required",
        };
      }

      //check user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw {
          name: "UnathorizedError",
          message: "Invalid email/password",
        };
      }

      //check password
      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw {
          name: "UnathorizedError",
          message: "Invalid email/password",
        };
      }

      const token = signToken({ id: user.id });
      res.status(200).json({ message: "Login Success", access_token: token });
    } catch (err) {
      console.log(err, "<<<<< ControllerUser.login");
      next(err);
    }
  }
}
module.exports = ControllerUser;
