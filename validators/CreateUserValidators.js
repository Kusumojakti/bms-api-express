"use strict";

const { body } = require("express-validator");
const Users = require("../models/user");

const createUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name must be required")
    .isString()
    .withMessage("Nama harus sebuah String"),

  body("email")
    .notEmpty()
    .withMessage("Email must be required")
    .isEmail()
    .withMessage("Email tidak valid")
    .custom(async (value) => {
      const response = await Users.findOne({ where: { email: value } });
      if (response) {
        throw new Error("Email sudah terdaftar");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Password harus memiliki minimal 8 karakter"),

  body("confirm_password")
    .notEmpty()
    .withMessage("Konfirmasi Password tidak boleh kosong")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Konfirmasi password tidak sama dengan password");
      }
      return true;
    }),
];

module.exports = createUserValidator;
