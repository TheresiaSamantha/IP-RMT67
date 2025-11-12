const { MyList, Book } = require("../models");

class ControllerMyList {
  // GET /mylist
  // return list of MyList entries for current user, include Book details
  static async getMyList(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId)
        throw { name: "UnathorizedError", message: "User not authenticated" };

      const lists = await MyList.findAll({
        where: { UserId: userId },
        include: [{ model: Book }],
        order: [["id", "DESC"]],
      });

      res.status(200).json(lists);
    } catch (err) {
      next(err);
    }
  }

  // POST /mylist/:id
  // Add book to user's list by BookId passed as route param (no request body required)
  static async addToMyList(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId)
        throw { name: "UnathorizedError", message: "User not authenticated" };

      const BookId = req.params && req.params.id ? Number(req.params.id) : null;
      const note = null; // no body input expected; note is empty
      if (!BookId)
        throw {
          name: "BadRequest",
          message: "BookId is required in route param (:id)",
        };

      // ensure book exists
      const book = await Book.findByPk(BookId);
      if (!book) throw { name: "NotFound", message: "Book not found" };

      // avoid duplicates (if your migration enforces unique_user_book this is optional)
      const existing = await MyList.findOne({
        where: { UserId: userId, BookId },
      });
      if (existing) {
        return res
          .status(200)
          .json({ message: "Already in MyList", data: existing });
      }

      const created = await MyList.create({ UserId: userId, BookId, note });
      res.status(201).json({ message: "Added to MyList", data: created });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /mylist/:id
  // body: { note }
  static async updateNote(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId)
        throw { name: "UnathorizedError", message: "User not authenticated" };

      const id = Number(req.params.id);
      const { note } = req.body;

      // allow onlyUser middleware to attach the found item as req.myListItem
      let item = null;
      if (req && req.myListItem != null) {
        item = req.myListItem;
      } else {
        item = await MyList.findByPk(id);
      }
      console.log("🚀 ~ ControllerMyList ~ updateNote ~ item:", item);

      if (!item) throw { name: "NotFound", message: "MyList item not found" };
      if (item.UserId !== userId)
        throw { name: "Forbidden", message: "Not allowed" };

      item.note = note;
      await item.save();

      // return the single updated mylist item (with Book included)
      const updated = await MyList.findByPk(item.id);
      res.status(200).json({ message: "Updated", data: item });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /mylist/:id
  static async deleteFromMyList(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId)
        throw { name: "UnathorizedError", message: "User not authenticated" };

      const id = Number(req.params.id);
      // allow onlyUser to attach the item
      let item = null;
      if (req && req.myListItem != null) {
        item = req.myListItem;
      } else {
        item = await MyList.findByPk(id);
      }
      if (!item) throw { name: "NotFound", message: "MyList item not found" };
      if (item.UserId !== userId)
        throw { name: "Forbidden", message: "Not allowed" };
      //   console.log("🚀 ~ ControllerMyList ~ deleteFromMyList ~ item:", item);

      await MyList.destroy({ where: { id: item.BookId } });
      res.status(200).json({ message: "Removed from MyList" });
    } catch (err) {
      //   console.log("🚀 ~ ControllerMyList ~ deleteFromMyList ~ err:", err);
      next(err);
    }
  }
}

module.exports = ControllerMyList;
