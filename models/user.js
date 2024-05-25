"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Role = require("./role");

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    User.belongsTo(models.Role, { foreignKey: "id_roles", as: "role" });
  }
}

User.init(
  {
    // id: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    id_roles: DataTypes.INTEGER,
    refresh_token: DataTypes.TEXT,
  },
  {
    modelName: "User",
    tableName: "users",
    sequelize,
  }
);

module.exports = User;
