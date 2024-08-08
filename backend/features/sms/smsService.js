const smsRepository = require("./smsRepository");
const { User } = require("../../config/connection").db;
const CustomError = require("../../utils/CustomError");
const signToken = require("../../utils/signToken");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendOtp = async (phoneNumber) => {
  const user = await smsRepository.findUserByPhoneNumber(phoneNumber);
  if (!user) {
    throw new CustomError("Phone number is not linked with any mygate account", 404);
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  await smsRepository.saveOtp(phoneNumber, otp);
  await client.messages.create({
    body: `Your 6-digit OTP code for logging into mygate application is ${otp}. OTP will be valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${phoneNumber}`,
  });
};

exports.verifyOtp = async (phoneNumber, otp) => {
  const user = await smsRepository.verifyOtp(phoneNumber, otp);

  if (!user) {
    throw new CustomError("Invalid or expired OTP", 400);
  }

  const token = signToken(user.id, user.email);

  return token;
};
