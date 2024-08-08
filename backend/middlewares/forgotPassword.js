const { db } = require("../config/connection");
const signToken = require("../utils/signToken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const util = require("util");

const { User } = db;





exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    // 1. GET USER BASED ON POSTED EMAIL
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
  
    if (!user) {
      return next(new CustomError("user with the given credential does not exist!", 401));
    }
  
    // 2. GENERATE A RANDOM RESET TOKEN
    const resetToken = await vendor.createResetPasswordToken();
  
    await vendor.save({ validateBeforeSave: false });
  
    // 3. SEND THE TOKEN BACK TO VENDOR'S EMAIL
    const resetUrl = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;
    const message = `We have recieved a password reset request. Please use below link to reset your password.\n\n${resetUrl}\n\nThis reset password link will expire in 10 minutes`;
  
    try {
      await sendEmail({
        email: vendor.email,
        subject: "Password change request recieved",
        message: message,
      });
  
      res.status(200).json({
        status: "Success",
        message: "Password reset link has been sent to vendor's email",
      });
    } catch (err) {
      vendor.passwordResetToken = undefined;
      vendor.passwordResetTokenExpires = undefined;
      vendor.save({ validateBeforeSave: false });
  
      return next(new CustomError("There was an error sending password reset email. Please try again later!", 500));
    }
  });
  
//   exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
//     const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
  
//     const vendor = await Vendor.findOne({
//       where: {
//         passwordResetToken: token,
//         passwordResetTokenExpires: { [Op.gt]: Date.now() },
//       },
//     });
  
//     if (!vendor) {
//       return next(new CustomError("Token is invalid or has expired!", 400));
//     }
  
//     // Reseting the vendor password details
//     vendor.password = req.body.password;
//     vendor.confirmPassword = req.body.confirmPassword;
//     vendor.passwordResetToken = null;
//     vendor.passwordResetTokenExpires = null;
//     vendor.passwordChangedAt = Date.now();
  
//     await vendor.save();
  
//     // login the user
//     const loginToken = signToken(vendor.id);
  
//     // res.cookie("jwtAuth", loginToken, {
//     //   maxAge: process.env.LOGIN_EXPIRES,
//     //   // secure:true,
//     //   httpOnly: true,
//     // });
  
//     res.status(200).json({
//       status: "Success",
//       token: loginToken,
//       message:"Password has been reset successfully"
//     });
//   });