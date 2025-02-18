"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class User extends Model {
  static associate(models) {}
}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM(["admin", "teknisi"]),
    token: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

module.exports = User;
