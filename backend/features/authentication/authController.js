const authService = require("./authService");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/CustomError");
const passport = require("passport");

// Handle user login
exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }

  const token = await authService.login(email, password);

  res.cookie("jwtToken", token, {
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "Strict",
  });
  res.status(200).json({ status: "success", token });
});

// Handle user logout
exports.logout = asyncErrorHandler(async (req, res, next) => {
  res.clearCookie("jwtToken", { expires: new Date(Date.now()) });
  res.clearCookie("connect.sid", { expires: new Date(Date.now()) });
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully" });
});

// Protect routes
exports.protect = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token && !req.isAuthenticated()) {
    return next(new CustomError("You are not logged in!", 401));
  }

  req.user = await authService.protect(token, req);
  next();
});

// Google OAuth routes
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
exports.googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/login",
});

exports.googleAuthSuccess = (req, res) => {
  const token = authService.signToken(req.user.id, req.user.email);
  res.cookie("jwtToken", token, {
    expiresIn: "1d",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.redirect(`http://localhost:4200/google/success?token=${token}`);
};

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return next(new CustomError("Please provide an email address", 400));

  await authService.forgotPassword(req, email);
  res.status(200).json({ status: "success", message: "Token sent to email!" });
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!token || !password)
    return next(
      new CustomError("Please provide a token and new password", 400)
    );

  const newToken = await authService.resetPassword(token, password);
  res.cookie("jwtToken", newToken, { expiresIn: "1d" });
  res.status(200).json({ status: "success", token: newToken });
});
