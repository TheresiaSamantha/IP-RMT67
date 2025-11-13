"use strict";

const users = require("../data/users.json");
const { hashPassword } = require("../helpers/bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const data = await Promise.all(
      users.map(async (u) => ({
        userName: u.userName,
        email: u.email,
        password: await hashPassword(u.password),
        createdAt: now,
        updatedAt: now,
      }))
    );

    return queryInterface.bulkInsert("Users", data, {});
  },

  async down(queryInterface, Sequelize) {
    const emails = users.map((u) => u.email);
    return queryInterface.bulkDelete("Users", { email: emails }, {});
  },
};
