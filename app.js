"use strict";

var cookieParser = require("cookie-parser");
var express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const JwtMiddleware = require("./middleware/JWTMiddleware");
const http = require("http");
require("dotenv").config();
// require("./config/websocket");

const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/users");
const EwsRoutes = require("./routes/EwsRoutes");
const SystemRoutes = require("./routes/SystemRoutes");
const { Server } = require("socket.io");

var app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["authorization"],
    credentials: true,
  },
  perMessageDeflate: {
    threshold: 1024,
  },
});

io.use((socket, next) => {
  let token = socket.handshake.auth?.token;
  let apiKey = socket.handshake.auth?.apiKey;

  if (!token) {
    token = socket.handshake.headers["authorization"]?.split(" ")[1];
  }

  if (!apiKey) {
    apiKey = socket.handshake.headers["apikey"];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(
        "✅ User Authenticated:",
        `${decoded.username} with ${socket.id}`
      );
      socket.user = decoded;
      return next();
    } catch (error) {
      console.error("❌ JWT Verification Error:", error.message);
      return next(new Error("Invalid Token"));
    }
  }

  if (apiKey && apiKey === process.env.API_KEY_SECRET) {
    console.log("✅ IoT Device Connected " + socket.id);
    socket.isIoT = true;
    return next();
  }

  return next(new Error("Authentication Error: No Valid Token or API Key"));
}).on("connection", (socket) => {
  // console.log("User Connected: " + socket.id);

  socket.on("message", (data) => {
    console.log("Message received: ", data);
    io.emit("message", `Server menerima: ${data}`);
  });
  socket.on("private-message", ({ receiverId, message }) => {
    console.log(`Pesan dari ${socket.id} ke ${receiverId}: ${message}`);
    io.to(receiverId).emit("private-message", {
      senderId: socket.id,
      message: message,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Middleware routes
app.use("/api/user", JwtMiddleware, UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/ews", JwtMiddleware, EwsRoutes);
app.use("/api/iot", SystemRoutes);

// Jalankan server
server.listen(process.env.PORT, () => {
  console.log(`Server Running on PORT ${process.env.PORT}`);
});

module.exports = app;
