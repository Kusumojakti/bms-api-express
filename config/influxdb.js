"use strict";

const { InfluxDBClient, InfluxDB } = require("@influxdata/influxdb-client");

const influxDBClient = new InfluxDB({
  url: process.env.INFLUXDB_URL,
  token: process.env.INFLUXDB_TOKEN,
});

module.exports = influxDBClient;
