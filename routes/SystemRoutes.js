"use strict";

const express = require("express");
const router = express.Router();
const SystemControllers = require("../controllers/SystemControllers");
const verifytoken = require("../middleware/VerifyToken");
// const storeSuhuValidator = require("../validators/storeSuhuValidator");
// const storeVolumeValidator = require("../validators/storeVolumeValidator");

router.post("/store-conditions", SystemControllers.storeData);
router.get("/conditions/", SystemControllers.showData);

module.exports = router;
