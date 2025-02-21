"use client";

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const db = require("../config/config");

var app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication Error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    return next(new Error("Invalid Token"));
  }
});

io.on("connection", async (socket) => {
  console.log("User Connected: " + socket.id);

  socket.on("message", (data) => {
    console.log("Message received: ", data);
    io.emit("message", `Server menerima: ${data}`);
  });

  if (!socket.user) {
    socket.disconnect();
    return;
  }

  const userId = socket.user.id;

  await db.query("UPDATE users SET socket_id = ? WHERE id = ?", [
    socket.id,
    userId,
  ]);

  // Event ketika user mengirim pesan
  socket.on("private-message", async ({ receiverId, message }) => {
    const [receiver] = await db.query(
      "SELECT socket_id FROM users WHERE id = ?",
      [receiverId]
    );

    if (receiver?.socket_id) {
      io.to(receiver.socket_id).emit("private-message", {
        senderId: socket.id,
        message: message,
      });
    }
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected: " + socket.id);
    await db.query("UPDATE users SET socket_id = NULL WHERE socket_id = ?", [
      socket.id,
    ]);
  });
});

// Jalankan server
server.listen(process.env.PORT, () => {
  console.log(`Server Running on PORT ${process.env.PORT}`);
});
