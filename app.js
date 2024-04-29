"use strict";

var cookieParser = require("cookie-parser");
var express = require("express");
const cors = require("cors");
const JwtMiddleware = require("./middleware/JWTMiddleware");
require("dotenv").config();

const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/users");

var app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/user", JwtMiddleware, UserRoutes);
app.use("/api/auth", AuthRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server Running on PORT ${process.env.PORT}`);
});

module.exports = app;
