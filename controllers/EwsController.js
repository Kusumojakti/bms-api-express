"use strict";

const { validationResult } = require("express-validator");
const { response500, response404 } = require("../helpers/response");
const Ews = require("../models/ews");
require("dotenv").config();

async function store(req, res) {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: error.array().map((e) => e.msg),
      });
    }

    const deviceCounts = await Ews.count();
    const newDeviceId = `EWS${String(deviceCounts + 1).padStart(3, "0")}`;

    const data = {
      id: newDeviceId,
      nama_ews: req.body.nama_ews,
      alamat: req.body.alamat,
      lat: req.body.lat,
      long: req.body.long,
    };

    const newEws = await Ews.create(data);
    if (newEws) {
      return res.status(201).json({
        success: true,
        code: 201,
        message: "Successfully Added EWS",
        data: data,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: err.message,
    });
  }
}

async function show(req, res) {
  try {
    const ews = await Ews.findAll({
      attributes: ["id", "nama_ews", "alamat", "lat", "long"],
    });

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Berhasil mengambil data",
      data: ews,
    });
  } catch (err) {
    return response500(res);
  }
}

async function detail(req, res) {
  try {
    const ews = await Ews.findByPk(req.params.id);
    if (!ews) return response404(res, "EWS not found");

    return res.json({
      success: true,
      code: 200,
      message: "Successfully get data",
      data: ews,
    });
  } catch (err) {
    return response404(err);
  }
}

async function update(req, res) {
  try {
    const ews = await Ews.findByPk(req.params.id);
    if (!ews) return response404(res, "EWS not found");

    ews.nama_ews = req.body.nama_ews || ews.nama_ews;
    ews.alamat = req.body.alamat || ews.alamat;
    ews.lat = req.body.lat || ews.lat;
    ews.long = req.body.long || ews.long;

    await ews.save();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Data berhasil di update",
      data: ews,
    });
  } catch (err) {
    return response500(res, err.message);
  }
}

async function destroy(req, res) {
  try {
    const ews = await Ews.findByPk(req.params.id);
    if (!ews) return response404(res, "EWS tidak ditemukan");

    await ews.destroy();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Data berhasil dihapus",
    });
  } catch (err) {
    return response500(res, err.message);
  }
}

module.exports = { store, show, detail, update, destroy };
