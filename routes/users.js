("use strict");

const express = require("express");
const createUserValidator = require("../validators/CreateUserValidators");
const UsersController = require("../controllers/UserControllers");
const router = express.Router();

router.get("/", UsersController.show);
router.get("/:id", UsersController.detail);
router.put("/:id", UsersController.update);
router.delete("/:id", UsersController.destroy);

module.exports = router;
