"use strict";

const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const JwtMiddleware = require("./middleware/JWTMiddleware");
require("dotenv").config();
require("./services/websocket");
require("./services/mqtt");

const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/users");
const EwsRoutes = require("./routes/EwsRoutes");
const SystemRoutes = require("./routes/SystemRoutes");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// WebSocket Connection
// wss.on("connection", (ws, req) => {
//   console.log("New WebSocket Connection");

//   // Cek apakah ada token atau API Key di headers
//   const token = req.headers["authorization"]?.split(" ")[1];
//   const apiKey = req.headers["apikey"];

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       console.log("✅ User Authenticated:", decoded.username);
//       ws.user = decoded;
//     } catch (error) {
//       console.error("❌ JWT Verification Error:", error.message);
//       ws.send(JSON.stringify({ error: "Invalid Token" }));
//       ws.close();
//       return;
//     }
//   } else if (apiKey && apiKey === process.env.API_KEY_SECRET) {
//     console.log("✅ IoT Device Connected");
//     ws.isIoT = true;
//   } else {
//     console.log("❌ Authentication Error: No Valid Token or API Key");
//     ws.send(JSON.stringify({ error: "Authentication Failed" }));
//     ws.close();
//     return;
//   }

// wss.on("message", (message) => {
//   console.log("Message received: ", message);

//   // Broadcast message ke semua client
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(`Server menerima: ${message}`);
//     }
//   });
// });

// wss.on("close", () => {
//   console.log("Client Disconnected");
// });
// // });

// Middleware routes
app.use("/api/user", JwtMiddleware, UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/ews", JwtMiddleware, EwsRoutes);
app.use("/api/iot", SystemRoutes);

// Jalankan server
// server.listen(process.env.PORT, () => {
//   console.log(`Server Running on PORT ${process.env.PORT}`);
// });

module.exports = app;
