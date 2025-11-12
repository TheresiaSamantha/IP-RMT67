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

  // static async OpenAi(req, res, next) {
  //   try {
  //     const result = await openaiAPI("write a haiku about ai");
  //     res.status(200).json({ message: result });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async getBooks(req, res, next) {
    try {
      // Pagination: use query params `page` and `limit` (optional)
      // Example: /books?page=2&limit=20
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.max(Number(req.query.limit) || 10, 1);
      const offset = (page - 1) * limit;

      const result = await Book.findAndCountAll({
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const total = result.count;
      const totalPages = Math.ceil(total / limit) || 1;

      res.status(200).json({
        data: result.rows,
        meta: {
          total,
          page,
          perPage: limit,
          totalPages,
        },
      });
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
      if (!book.aiSummary) {
        const aiSummary = await openaiAPI(
          `Provide a brief summary for the book titled "${book.title}" by ${book.author}.`
        );
        book.aiSummary = aiSummary;
        console.log(
          "🚀 ~ Controller ~ getDetailBook ~ book.aiSummary:",
          book.aiSummary
        );
        await book.update({ aiSummary });
      }
      res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = Controller;
