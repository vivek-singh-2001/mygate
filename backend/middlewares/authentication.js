const { db } = require("../config/connection");
const signToken = require("../utils/signToken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");
const util = require("util");

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
    expiresIn: process.env.JWT_EXPIRES_IN * 60 ,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});

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

exports.protect = asyncErrorHandler(async (req, res, next) => {
  // 1. Read the token and check if it exists
  const { jwtToken: token } = req.cookies;

  if (!token) {
    next(new CustomError("You are not logged in!", 401));
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

exports.logout = asyncErrorHandler(async (req, res, next) => {
  const role = req.params.role;

  if (role === "admin" || role === "vendor") {
    // Clear the JWT token cookie
    res.clearCookie("jwtAuth", {
      expires: new Date(Date.now()),
      // httpOnly: true,
    });
    res.clearCookie("loggedRole", {
      expires: new Date(Date.now()),
      // httpOnly: true,
    });

    res.status(200).json({
      status: "Success",
      message: `${role} logged out successfully`,
    });
  } else {
    return next(new CustomError("Page not Found!", 404));
  }
});
