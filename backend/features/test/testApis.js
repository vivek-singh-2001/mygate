const express = require("express");
const router = express.Router();
const testController = require("./testController");

router.post("/cleanup", testController.cleanup);

module.exports = router;