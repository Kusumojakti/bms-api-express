"use strict";

const { validationResult } = require("express-validator");
const {
  response400,
  response404,
  response500,
} = require("../helpers/response");
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function login(req, res) {
  try {
    const error = validationResult(req);
    if (!error.isEmpty) {
      return response400(
        res,
        error.array().map((e) => e.msg)
      );
    }

    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) return response404(res, "Email not Registered!");

    console.log(user);

    const check = await bcrypt.compare(req.body.password, user.password);
    if (!check) return response400(res, "Wrong Password!");
    const id = user.id;
    const email = user.email;
    const accesstoken = jwt.sign(
      { id, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );
    const refreshtoken = jwt.sign(
      { id, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refreshtoken: refreshtoken },
      {
        where: {
          id: id,
        },
      }
    );
    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "success", accesstoken });
  } catch (err) {
    return response500(res, err.message);
  }
}

module.exports = {
  login,
};