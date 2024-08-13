const { User } = require("../../config/connection").db;

exports.findUserByPhoneNumber = async (phoneNumber) => {
    return await User.findOne({ where: { number: phoneNumber , isOwner:true} });
};

exports.saveOtp = async (phoneNumber, otp) => {
  console.log(phoneNumber, otp);

  await User.update(
    { otp, otpExpiry: Date.now() + 5 * 60 * 1000 },
    { where: { number: phoneNumber } }
  );
};

exports.verifyOtp = async (phoneNumber, otp) => {
  const user = await User.findOne({ where: { number: phoneNumber, otp } });

  if (user && user.otpExpiry > Date.now()) {
    await User.update(
      { otp: null, otpExpiry: null },
      { where: { number: phoneNumber } }
    );
    return user;
  }

  return null;
};
