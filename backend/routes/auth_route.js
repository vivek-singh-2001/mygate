const express = require("express");
const authController = require("../middlewares/authentication");

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);

// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback, authController.googleAuthSuccess);

module.exports = router;
