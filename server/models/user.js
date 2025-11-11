"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // many-to-many: Users <-> Books through MyList
      User.belongsToMany(models.Book, {
        through: models.MyList,
        foreignKey: "UserId",
        otherKey: "BookId",
      });
      User.hasMany(models.MyList, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
