const express = require('express');
const authController = require('./authController');
const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback, authController.googleAuthSuccess);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


module.exports = router;
