"use strict";

const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const { response401 } = require("../helpers/response");
require("dotenv").config();

async function JwtMiddleware(req, res, next) {
  try {
    const token = req.header("Authorization").split(" ")[1];

    // // verif token
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decode);

    const user = await Users.findOne({ where: { id: decode.sub } });

    if (!user) return response401(res);

    next();
  } catch (err) {
    console.log(err);
    return response401(res, err.message);
  }
}

module.exports = JwtMiddleware;
