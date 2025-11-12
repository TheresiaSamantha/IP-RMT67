const openaiAPI = require("../helpers/openAi");
const { Book } = require("../models");

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
      const books = await Book.findAll();
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }

  static async getDetailBook(req, res, next) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = Controller;
