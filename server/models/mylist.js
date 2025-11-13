"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MyList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // join table associations
      MyList.belongsTo(models.User, { foreignKey: "UserId" });
      MyList.belongsTo(models.Book, { foreignKey: "BookId" });
    }
  }
  MyList.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: DataTypes.INTEGER,
      BookId: DataTypes.INTEGER,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "MyList",
    }
  );
  return MyList;
};
