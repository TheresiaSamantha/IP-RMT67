const openaiAPI = require("../helpers/openAi");

class Controller {
  static async home(req, res, next) {
    try {
      res.status(200).json({ message: "Server is running" });
    } catch (error) {
      next(error);
    }
  }

  static async OpenAi(req, res, next) {
    try {
      const result = await openaiAPI("write a haiku about ai");
      res.status(200).json({ message: result });
    } catch (error) {
      next(error);
    }
  }

  static async getBooks(req, res, next) {
    try {
      const { Book } = require("../models");
      const books = await Book.findAll();
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = Controller;
