"use strict";

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

class ews extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }
}
ews.init(
  {
    nama_ews: DataTypes.STRING,
    alamat: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
  },
  {
    sequelize,
    modelName: "ews",
  }
);
module.exports = ews;
