"use strict";

const axios = require("axios");

module.exports = {
  async up(queryInterface, Sequelize) {
    const API_KEY = process.env.GOOGLE_API_KEY;
    if (!API_KEY) throw new Error("GOOGLE_API_KEY is not set in environment");

    const now = new Date();
    const results = [];

    // Google Books API: maxResults per request is 40. We'll fetch 40 + 10 = 50 total.
    const fetchChunk = async (startIndex, maxResults) => {
      const url = `https://www.googleapis.com/books/v1/volumes?q=&orderBy=newest&startIndex=${startIndex}&maxResults=${maxResults}&key=${API_KEY}`;
      const res = await axios.get(url);
      return res.data.items || [];
    };

    const items1 = await fetchChunk(0, 40);
    const items2 = await fetchChunk(40, 10);

    const all = items1.concat(items2).slice(0, 50);

    all.forEach((i) => {
      const info = i.volumeInfo || {};
      results.push({
        title: info.title || "Unknown Title",
        author: (info.authors || []).join(", "),
        coverUrl: info.imageLinks
          ? info.imageLinks.thumbnail || info.imageLinks.smallThumbnail
          : null,
        description: info.description || info.subtitle || null,
        category: (info.categories || []).join(", "),
        createdAt: now,
        updatedAt: now,
      });
    });

    if (results.length === 0) {
      console.warn("No books fetched from Google Books API");
      return;
    }

    // Bulk insert into Books table
    await queryInterface.bulkInsert("Books", results, {});
  },

  async down(queryInterface, Sequelize) {
    // Simple rollback: remove recently inserted rows by matching titles fetched earlier is hard
    // We'll instead remove books that have a non-null coverUrl and a createdAt within a recent window
    // WARNING: this is a best-effort rollback. For deterministic rollback, keep inserted titles.
    const Op = Sequelize.Op;
    const recent = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7); // 7 days ago
    await queryInterface.bulkDelete(
      "Books",
      {
        createdAt: { [Op.gte]: recent },
      },
      {}
    );
  },
};
