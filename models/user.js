"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Role = require("./role");

class User extends Model {
  static associate(models) {
    User.belongsTo(models.Role, {
      foreignKey: "id_roles",
      as: "role",
    });
  }
}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    id_roles: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: "id",
      },
    },
    refresh_token: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

module.exports = User;
