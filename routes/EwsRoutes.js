"use strict";

const express = require("express");
const router = express.Router();
const EwsControllers = require("../controllers/EwsController");
const EwsValidators = require("../validators/NewEwsValidator");

router.post("/create", EwsValidators, EwsControllers.store);
router.get("/", EwsControllers.show);
router.get("/:id", EwsControllers.detail);
router.put("/:id", EwsControllers.update);
router.delete("/:id", EwsControllers.destroy);

module.exports = router;
