const openaiAPI = require("../helpers/openAi");

class Controller {
  static async home(req, res) {
    try {
      res.status(200).json({ message: "Welcome to the Home Page" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async OpenAi(req, res) {
    try {
      const result = await openaiAPI("write a haiku about ai");
      res.status(200).json({ message: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBooks(req, res) {
    try {
      const { Book } = require("../models");
      const books = await Book.findAll();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = Controller;
