const { User } = require("../../config/connection").db;
const CustomError = require("../../utils/CustomError");
const signToken = require("../../utils/signToken");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");
const sendSms = require("../../utils/sendSms");
const util = require("util");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.validPassword(password))) {
    throw new CustomError("Invalid email or password", 401);
  }
  return signToken(user.id, user.email);
};

exports.protect = async (token, req) => {
  if (token) {
    const decodedToken = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    const user = await User.findByPk(decodedToken.id);
    if (!user) throw new CustomError("User does not exist!", 401);
    if (await user.isPasswordChanged(decodedToken.iat))
      throw new CustomError(
        "Password has been changed recently. Please login again!",
        401
      );
    return user;
  } else if (req.isAuthenticated()) {
    return req.user;
  } else {
    throw new CustomError("You are not logged in!", 401);
  }
};

exports.signToken = signToken;

exports.forgotPassword = async (req, email) => {
  const user = await User.findOne({ where: { email } });

  if (!user)
    throw new CustomError("There is no user with given email address", 404);

  const resetToken = await user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false }); 

  const resetURL = `${req.protocol}://localhost:7500/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;
  await sendEmail({
    email: user.email,
    subject: "Your password reset token (valid for 10 minutes)",
    message,
  });

  // Send SMS
  if (user.number) {
    const smsMessage = `Your password reset link: ${resetURL}\nValid for 10 minutes.`;
    try {
      await sendSms(user.number, smsMessage);
    } catch (error) {
      console.error("Error sending SMS:", error);
      // Handle SMS sending error, if needed
    }
  }

  return resetToken;
};

exports.resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) throw new CustomError("Token is invalid or has expired", 400);

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetTokenExpires = null;
  await user.save();

  const newToken = signToken(user.id, user.email);
  return newToken;
};
