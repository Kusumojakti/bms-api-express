"use strict";

const { body, header } = require("express-validator");
const ews = require("../models/ews");

const EwsValidators = [
  // header("refresh_token")
  //   .notEmpty()
  //   .withMessage("Api Token tidak boleh kosong")
  //   .custom(async (value) => {
  //     const user = await ews.findOne({ where: { refresh_token: value } });
  //     if (!user) throw new Error("Api Token tidak valid");

  //     return true;
  //   }),
  body("nama_ews")
    .notEmpty()
    .withMessage("Name must be required!")
    .isNumeric()
    .withMessage("Invalid input name"),

  body("alamat")
    .notEmpty()
    .withMessage("Alamat or address must be required")
    .isNumeric()
    .withMessage("Address not valid"),

  body("lat")
    .notEmpty()
    .withMessage("Lat must be required!")
    .isNumeric()
    .withMessage("Invalid format"),

  body("long")
    .notEmpty()
    .withMessage("Long must be required!")
    .isNumeric()
    .withMessage("Invalid format"),
];

module.exports = EwsValidators;
