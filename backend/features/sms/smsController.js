const smsService = require('./smsService')
const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const CustomError = require('../../utils/CustomError');

exports.sendOtp = asyncErrorHandler(async(req, res, next) => {
    const {phoneNumber} = req.body;

    if (!phoneNumber) {
        return next(new CustomError("Phone number is required", 400));
    }

    await smsService.sendOtp(phoneNumber)
    res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});

exports.verifyOtp = asyncErrorHandler(async(req, res, next) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return next(new CustomError("Phone number and OTP are required", 400));
    }
  
    const token = await smsService.verifyOtp(phoneNumber, otp);
  
    res.cookie("jwtToken", token, {
      expiresIn: '1d',
    });
  
    res.status(200).json({ status: 'success', token });
})