"use strict";

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

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

    const userCount = await User.count();
    const newUserId = `US${String(userCount + 1).padStart(3, "0")}`;

    const data = {
      id: newUserId,
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    };
    const newUser = await User.create(data);
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
    const user = await User.findAll({
      attributes: ["id", "name", "email", "role"],
    });

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Berhasil mengambil data",
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      code: 500,
      message: err.message,
    });
  }
}

async function detail(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      code: 200,
      message: "Data user berhasil didapatkan",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.id_roles = req.body.id_roles || user.id_roles;

    await user.save();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Data berhasil di update",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function destroy(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });

    await user.destroy();

    return res.status(200).json({
      success: true,
      code: 200,
      message: "Data berhasil dihapus",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  store,
  show,
  detail,
  update,
  destroy,
};
