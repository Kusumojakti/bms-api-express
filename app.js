"use strict";

const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const JwtMiddleware = require("./middleware/JWTMiddleware");

require("dotenv").config();
require("./services/websocket");
require("./services/mqtt");

const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/users");
const EwsRoutes = require("./routes/EwsRoutes");
const SystemRoutes = require("./routes/SystemRoutes");
const { InitializeWebsocket } = require("./services/websocket");

const app = express();
const server = http.createServer(app);
InitializeWebsocket(server);

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware routes
app.use("/api/user", JwtMiddleware, UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/ews", JwtMiddleware, EwsRoutes);
app.use("/api/iot", SystemRoutes);

// app.listen(8080, () => {
//   console.log(`Express Server Running on PORT ${8080}`);
// });
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server Running on PORT ${process.env.PORT || 5000}`);
});

module.exports = app;
