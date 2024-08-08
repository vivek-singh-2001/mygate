const smsService = require("./smsService");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/CustomError");

exports.sendOtp = asyncErrorHandler(async (req, res, next) => {
  const { contact } = req.body;
  
  if (!contact) {
    return next(new CustomError("Phone number or Email is required", 400));
  }

  await smsService.sendOtp(contact);
  res.status(200).json({
    status: "success",
    message: "OTP sent successfully",
  });
});

exports.verifyOtp = asyncErrorHandler(async (req, res, next) => {
  const { contact, otp } = req.body;

  if (!contact || !otp) {
    return next(new CustomError("Phone number and OTP are required", 400));
  }

  const token = await smsService.verifyOtp(contact, otp);

  res.cookie("jwtToken", token, {
    expiresIn: "1d",
  });

  res.status(200).json({ status: "success", token });
});
