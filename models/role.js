"use strict";
const { Model } = require("sequelize");
const sequelize = require("../config/sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.User, { foreignKey: "id_roles", as: "users" });
    }
  }
  Role.init(
    {
      id: DataTypes.INTEGER,
      name_role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Roles",
    }
  );
  return Role;
};
