"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class condition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  condition.init(
    {
      // id: DataTypes.INTEGER,
      temperature: DataTypes.FLOAT,
      voltage: DataTypes.FLOAT,
      ampere: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "condition",
    }
  );
  return condition;
};
