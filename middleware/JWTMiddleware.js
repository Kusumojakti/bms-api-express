"use strict";

require("../config/sequelize");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { response401 } = require("../helpers/response");

async function JwtMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // verification step 1 = verify token by key
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // verification step 2 = verify token by user id
    const user = await User.findOne({
      _id: decoded.sub,
    });
    if (!user) return response401(res);

    // verification step 3 = verify token by same token
    if (user.token !== token) return response401(res);

    next();
  } catch (err) {
    return response401(res);
  }
}

module.exports = JwtMiddleware;
