const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt.js");
const { signToken } = require("../helpers/jwt");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  static async googleLogin(req, res, next) {
    // Menerima token dari fron end
    const token = req.body.googleAccessToken;
    console.log("🚀 ~ ControllerUser ~ googleLogin ~ token:", token);

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // diambil di .env
      });
      const payload = ticket.getPayload();
      console.log("🚀 ~ ControllerUser ~ googleLogin ~ payload:", payload.name);

      // dengan google login, kita biarkan user tidak perlu register
      let user = await User.findOne({ where: { email: payload.email } });

      if (!user) {
        const password = Math.random().toString(36).slice(-256);
        user = await User.create({
          userName: payload.name,
          email: payload.email,
          // kalo pake google login, RANDOM SE RANDOM MUNGKIN
          password,
        });
      }

      const access_token = signToken({ id: user.id });
      res.json({ access_token });
    } catch (err) {
      console.log("🚀 ~ ControllerUser ~ googleLogin ~ err:", err);
      next(err);
    }
  }
}
module.exports = ControllerUser;
