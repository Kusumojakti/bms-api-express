"use strict";

const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthControllers");
const UsersController = require("../controllers/UserControllers");
const LoginValidator = require("../validators/LoginValidators");
const CreateUserValidator = require("../validators/CreateUserValidators");

router.post("/login", LoginValidator, AuthController.login);
router.post("/register", CreateUserValidator, UsersController.store);

module.exports = router;
