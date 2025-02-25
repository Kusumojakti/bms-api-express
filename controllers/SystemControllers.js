"use strict";

const { validationResult } = require("express-validator");
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
const knex = require("../config/config");
const Ews = require("../models/ews");

async function storeData(req, res) {
  try {
    const error = validationResult(req);
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
      .tag("id", req.body.id)
      .floatField("temp", req.body.temp)
      .floatField("voltage", req.body.voltage)
      .floatField("ampere", req.body.ampere)
      // adding new
      .floatField("soc", req.body.soc)
      .floatField("soh", req.body.soh);
    storeData.writePoint(point);

    await storeData.flush();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Data berhasil disimpan",
      data: {
        id: req.body.id,
        temp: req.body.temp,
        voltage: req.body.voltage,
        ampere: req.body.ampere,
        soh: req.body.soh,
        soc: req.body.soc,
      },
    });
  } catch (err) {
    return response500(res, err.message);
  }
}

async function showData(req, res) {
  try {
    console.log("Mengambil semua data EWS...");

    // Ambil semua data EWS dari database
    const ewsList = await Ews.findAll();

    console.log(`Total EWS ditemukan: ${ewsList.length}`);

    if (!ewsList || ewsList.length === 0) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "Tidak ada data EWS yang ditemukan.",
      });
    }

    // Ambil semua data condition dari InfluxDB tanpa filter ID
    const queryApi = influxDBClient.getQueryApi(process.env.INFLUXDB_ORG);
    const fluxQuery = `from(bucket: "${process.env.INFLUXDB_BUCKET}")
            |> range(start: -1h)
            |> filter(fn: (r) => r["_measurement"] == "conditions")
            |> filter(fn: (r) => r["_field"] == "ampere" or r["_field"] == "temp" or r["_field"] == "voltage" or r["_field"] == "soh" or r["_field"] == "soc")
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
        // Menyusun hasil agar setiap EWS memiliki condition sesuai dengan ID-nya
        const ewsWithCondition = ewsList.map((ews) => {
          return {
            ...ews.toJSON(),
            condition: result.filter((cond) => cond.id === ews.id) || [],
          };
        });

        res.send({
          success: true,
          code: 200,
          message: "Data fetched successfully",
          data: {
            ews: ewsWithCondition,
          },
        });
      },
    });
  } catch (err) {
    console.error("Error saat mengambil data EWS:", err);
    return res.status(500).json({
      success: false,
      code: 500,
      message: err.message,
    });
  }
}

// async function showData(req, res) {
//   try {
//     const ewsId = req.params.id;
//     const queryApi = influxDBClient.getQueryApi(process.env.INFLUXDB_ORG);
//     const fluxQuery = `from(bucket: "${process.env.INFLUXDB_BUCKET}")
//         |> range(start: -1h)
//         |> filter(fn: (r) => r["_measurement"] == "conditions")
//         |> filter(fn: (r) => r["_field"] == "ampere" or r["_field"] == "temp" or r["_field"] == "voltage" or r["_field"] == "soh" or r["_field"] == "soc")
//         |> filter(fn: (r) => r["id"] == "${ewsId}")
//         |> yield(name: "mean")`;
//     const result = [];
//     queryApi.queryRows(fluxQuery, {
//       next(row, tableMeta) {
//         const obj = tableMeta.toObject(row);
//         result.push(obj);
//       },
//       error(error) {
//         console.error(error);
//         return res.status(500).json({
//           success: false,
//           code: 500,
//           message: error.message,
//         });
//       },
//       complete() {
//         res.send({
//           success: true,
//           code: 200,
//           message: "Data fetched successfully",
//           data: result,
//         });
//       },
//     });
//   } catch (err) {
//     return response500(res, err.message);
//   }
// }

module.exports = {
  storeData,
  showData,
};
