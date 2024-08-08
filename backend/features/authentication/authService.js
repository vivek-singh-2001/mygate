const { db } = require("../../config/connection");
const signToken = require("../../utils/signToken");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/CustomError");
const jwt = require("jsonwebtoken");
const util = require("util");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sendEmail = require('../../utils/sedEmail')
const crypto = require("crypto");

const { User } = db;
const { Op } = require("sequelize");


exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }

  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.validPassword(password))) {
    return next(new Error("Invalid email or password"));
  }

  const token = signToken(user.id, user.email);

  res.cookie("jwtToken", token, {
    // httpOnly: true,
    // secure: process.env.NODE_ENV === "production",  // Only set cookie over HTTPS in production environment
    expiresIn: '1d',
  });

  res.status(200).json({
    status: "success",
    token,
  });
});


// logout the user

exports.logout = asyncErrorHandler(async (req, res, next) => {
  // Clear the JWT token cookie
  res.clearCookie("jwtToken", {
    expires: new Date(Date.now()),
    // httpOnly: true,
  });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});


// protect the access

exports.protect = asyncErrorHandler(async (req, res, next) => {
  // Check for JWT token
  const { jwtToken: token } = req.cookies;

  if (!token && !req.isAuthenticated()) {
    return next(new CustomError("You are not logged in!", 401));
  }

  if (token) {
    // Validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if the user exists
    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      return next(new CustomError("User does not exist!", 401));
    }

    // Check if the user changed the password after the token was issued
    if (await user.isPasswordChanged(decodedToken.iat)) {
      return next(new CustomError("Password has been changed recently. Please login again!", 401));
    }

    req.user = user;
  } else if (req.isAuthenticated()) {
    req.user = req.user; // User is authenticated via Google OAuth
  }

  next();
});


// Google OAuth routes
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login' });

exports.googleAuthSuccess = (req, res) => {
  const token = signToken(req.user.id, req.user.email);

  res.cookie("jwtToken", token, {
    expiresIn: '1d',
  });

  // res.redirect('/');
  res.json({
    message:"you are logged in successfully"
  })
};

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
    const resetToken = await user.createResetPasswordToken();
    console.log(resetToken);
  
    await user.save({ validateBeforeSave: false });
  
    // 3. SEND THE TOKEN BACK TO VENDOR'S EMAIL
    const resetUrl = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;
    const message = `We have recieved a password reset request. Please use below link to reset your password.\n\n${resetUrl}\n\nThis reset password link will expire in 10 minutes`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: "Password change request recieved",
        message: message,
      });
  
      res.status(200).json({
        status: "Success",
        message: `Password reset link has been sent to ${user.firstname}'s email`,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.save({ validateBeforeSave: false });
  
      return next(new CustomError("There was an error sending password reset email. Please try again later!", 500));
    }
  });



  exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
    const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
  
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: { [Op.gt]: Date.now() },
      },
    });
  
    if (!user) {
      return next(new CustomError("Token is invalid or has expired!", 400));
    }
  
    // Reseting the vendor password details
    user.password = req.body.password;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    user.passwordChangedAt = Date.now();
  
    await user.save();
  
    // login the user
    const loginToken = signToken(user.id,user.email);
  
    res.status(200).json({
      status: "Success",
      token: loginToken,
      message:"Password has been reset successfully"
    });
  });