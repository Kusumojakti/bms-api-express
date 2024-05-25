"use strict";

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Users = require("../models/user");
const roles = require("../models/role");
const Sequelize = require("sequelize");
const { response500, response404 } = require("../helpers/response");
const role = require("../models/role");

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

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const data = {
      id: req.body.user_id,
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    };
    const newUser = await Users.create(data);
    if (newUser) {
      return res.status(201).json({
        success: true,
        code: 201,
        message: "Successfully Added Users",
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
    const user = await Users.findAll({
      attributes: ["id", "name", "id_roles"],
      // include: {
      //   model: role,
      //   as: "role",
      //   attributes: ["name_role"],
      // },
    });

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Berhasil mengambil data",
      data: user,
    });
  } catch (err) {
    console.log(err);
    return response500(res);
  }
}

async function detail(req, res) {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return response404(res, "User not found");

    return res.json({
      success: true,
      code: 200,
      message: "Data user berhasil didapatkan",
      data: user,
    });
  } catch (err) {
    return response404(err);
  }
}

async function update(req, res) {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return response404(res, "User tidak ditemukan");

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role_id = req.body.role_id || user.role_id;

    await user.save();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Data berhasil di update",
      data: user,
    });
  } catch (err) {
    return response500(res, err.message);
  }
}

async function destroy(req, res) {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) return response404(res, "User tidak ditemukan");

    await user.destroy();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Data berhasil dihapus",
    });
  } catch (err) {
    return response500(res, err.message);
  }
}

module.exports = {
  store,
  show,
  detail,
  update,
  destroy,
};
