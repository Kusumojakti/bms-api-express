"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class Role extends Model {
  static associate(models) {
    Role.hasMany(models.User, {
      foreignKey: "id_roles",
      as: "users",
    });
  }
}

Role.init(
  {
    name_roles: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
  }
);

module.exports = Role;
