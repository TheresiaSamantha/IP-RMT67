"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const myListData = require("../data/myList.json");
    const now = new Date();

    const data = myListData.map((item) => ({
      UserId: item.UserId,
      BookId: item.BookId,
      note: item.note || null,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("MyLists", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("MyLists", { BookId: bookIds }, {});
  },
};
