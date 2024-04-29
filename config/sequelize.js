"use strict";

require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(config.development);

// test connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database Connected Failed");
  }
}

testConnection();

module.exports = sequelize;
