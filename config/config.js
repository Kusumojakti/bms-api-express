"use strict";

require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: null,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: null,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: null,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
