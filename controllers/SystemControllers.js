"use strict";

const { validationResult } = require("express-validator");
const ews = require("../models/ews");
const Users = require("../models/user");
const {
  response400,
  response500,
  response403,
  response404,
} = require("../helpers/response");
const InfluxDBClient = require("../config/influxdb");
const { Point } = require("@influxdata/influxdb-client");
const influxDBClient = require("../config/influxdb");

async function storeTemperature(req, res) {
  try {
    const error = validationResult(req);
    // console.log(req.headers['x-api-key'])
    if (!error.isEmpty())
      return response400(
        res,
        error.array().map((e) => e.msg)
      );

    const storeData = InfluxDBClient.getWriteApi(
      process.env.INFLUXDB_ORG,
      process.env.INFLUXDB_BUCKET,
      "ns"
    );
    const point = new Point("conditions")
      .tag("id", "EWS001")
      .floatField("temperature", req.body.temp)
      .floatField("voltage", req.body.voltage)
      .floatField("ampere", req.body.ampere);
    storeData.writePoint(point);

    await storeData.flush();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Data berhasil disimpan",
      data: {
        temp: req.body.temp,
        voltage: req.body.voltage,
        ampere: req.body.ampere,
      },
    });
  } catch (err) {
    return response500(res, err.message);
  }
}

async function showTemperature(req, res) {
  try {
    // const refreshToken = req.headers["accesstoken"];
    // if (!refreshToken) {
    //   return response403(res);
    // }

    // const user = await Users.findOne({ where: { apikey: refreshToken } });
    // if (!user) {
    //   return response400(res, "ApiKey tidak valid");
    // }

    const queryApi = influxDBClient.getQueryApi(process.env.INFLUXDB_ORG);
    const fluxQuery = `from(bucket: "${process.env.INFLUXDB_BUCKET}")
        |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "conditions")
  |> filter(fn: (r) => r["_field"] == "ampere" or r["_field"] == "temperature" or r["_field"] == "voltage")
  |> yield(name: "mean")`;
    const result = [];
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const obj = tableMeta.toObject(row);
        result.push(obj);
      },
      error(error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          code: 500,
          message: error.message,
        });
      },
      complete() {
        res.send({
          success: true,
          code: 200,
          message: "Data fetched successfully",
          data: result,
        });
      },
    });
  } catch (err) {
    return response500(res, err.message);
  }
}

module.exports = {
  storeTemperature,
  showTemperature,
};
