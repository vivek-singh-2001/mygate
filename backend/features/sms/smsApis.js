const express = require("express");
const smsController = require("./smsController");

const router = express.Router();

const { sendOtp, verifyOtp } = smsController;

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
