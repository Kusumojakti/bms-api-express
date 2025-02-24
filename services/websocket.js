const WebSocket = require("ws");

let wss; // ✅ Buat variabel global untuk WebSocket server

function InitializeWebsocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("✅ New client connected");

    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log("Message Received:", parsedMessage);

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
  if (!wss) {
    console.error("❌ WebSocket server is not initialized!");
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// ✅ Ekspor kedua fungsi
module.exports = { InitializeWebsocket, sendDatatoWebsocket };
