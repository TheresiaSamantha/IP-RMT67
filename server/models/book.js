"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // many-to-many: Books <-> Users through MyList
      Book.belongsToMany(models.User, {
        through: models.MyList,
        foreignKey: "BookId",
        otherKey: "UserId",
      });
      Book.hasMany(models.MyList, { foreignKey: "BookId" });
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      coverUrl: DataTypes.STRING,
      description: DataTypes.TEXT,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
