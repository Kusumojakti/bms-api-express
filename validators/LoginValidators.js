"use strict";

const { body } = require("express-validator");
const Users = require("../models/user");

const LoginValidator = [
  body("email")
    .isEmpty()
    .withMessage("Email must be required")
    .isEmail()
    .withMessage("Your Email is not valid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 character"),
];

module.exports = LoginValidator;
