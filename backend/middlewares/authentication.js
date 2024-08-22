const { db } = require("../config/connection");
const signToken = require("../utils/signToken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const util = require("util");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { User } = db;

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
  // 1. Read the token and check if it exists
  const { jwtToken: token } = req.cookies;

  if (!token) {
   return next(new CustomError("You are not logged in!", 401));
  }

  // 2. Validate the token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3. Check if the user exists
  const user = await User.findByPk(decodedToken.id);

  if (!user) {
    return next(new CustomError(
      "user does not exist!",
      401
    ));
  }
  // 4.Check if the user changed the password after the token was issued

  if (await user.isPasswordChanged(decodedToken.iat)) {
    return next(new CustomError(
      "Password has been changed recently. Please login again!",
      401
    ));
  }

  // 5. Attach vendor details to request object
  req.user = user;
  next();
});

// Google OAuth routes
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login' });

exports.googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect('/login'); // Redirect to login if no user is found
  }

  const token = signToken(req.user.id, req.user.email);

  res.cookie("jwtToken", token, {
    expiresIn: '1d',
  });

  res.redirect('/'); // Redirect to home or another page on successful sign-in
};