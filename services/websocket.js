const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

function InitializeWebsocket() {
  wss.on("connection", (ws) => {
    console.log("✅ New client connected");

    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log("Message Received : ", parsedMessage);

        const { clientId, topic, data } = parsedMessage;

        if (!clientId) {
          console.log("Client ID Missing. Ignoring message.");
          return;
        }

        console.log(`Verified Client ID: ${clientId}, broadcasting data`);

        sendDatatoWebsocket({ topic, data });
      } catch (err) {
        console.log("Client Disconnected");
      }
    });

    ws.on("close", () => {
      console.log("Client Disconnected");
    });
  });
}

function sendDatatoWebsocket(data) {
  wss.clients.forEach((client) => {
    if (client.readyState == WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

InitializeWebsocket();

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server Running on PORT ${process.env.PORT || 3000}`);
});

// ✅ Pastikan ekspor dilakukan dengan cara yang benar
module.exports = { InitializeWebsocket, sendDatatoWebsocket };
