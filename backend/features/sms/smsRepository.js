const { User } = require("../../config/connection").db;

exports.findUserByContact = async (contact, contactType) => {
  return await User.findOne({
    where: { [contactType]: contact, isOwner: true },
  });
};

exports.saveOtp = async (contact, contactType, otp) => {
  await User.update(
    { otp, otpExpiry: Date.now() + 5 * 60 * 1000 },
    { where: { [contactType]: contact, isOwner: true } }
  );
};

exports.verifyOtp = async (contact, contactType, otp) => {
  const user = await User.findOne({ where: { [contactType]: contact, otp } });

  if (user && user.otpExpiry > Date.now()) {
    await User.update(
      { otp: null, otpExpiry: null },
      { where: { [contactType]: contact } }
    );
    return user;
  }

  return null;
};
