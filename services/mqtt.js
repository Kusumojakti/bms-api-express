"use client";

var mqtt = require("mqtt");
const websocket = require("./websocket"); // ✅ Import dengan benar

const MQTT_TOPIC = "/shas/bms/";
var clientId = `usermqtt_${Math.random().toString(36).substring(2, 7)}`;

var client = mqtt.connect({
  clientId,
  MQTT_TOPIC,
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  protocol: process.env.MQTT_PROTOCOL,
  clean: true,
  connectTimeout: 4000,
});

function InitializeMQTT() {
  client.on("connect", () => {
    console.log("Connected to MQTT Broker");
    client.subscribe(MQTT_TOPIC, (err) => {
      if (err) {
        console.error("Subscription Error : ", err);
      } else {
        console.log(`Subscribed to topic ${MQTT_TOPIC}`);
      }
    });
  });

  client.on("error", (err) => {
    console.error("MQTT connection error : ", err);
  });
}

client.on("message", (topic, message) => {
  try {
    const parsedMessage = JSON.parse(message.toString());
    console.log(`Received JSON message on ${topic}`, parsedMessage);

    const sendData = {
      clientId,
      topic,
      data: parsedMessage,
    };

    // ✅ Pastikan pemanggilan fungsi dilakukan dengan benar
    websocket.sendDatatoWebsocket(sendData);
  } catch (error) {
    console.error("Error parsing MQTT message : ", error);
  }
});

InitializeMQTT();

module.exports = { client, InitializeMQTT };
