const authService = require('./authService');

exports.login = authService.login;
exports.logout = authService.logout;
exports.protect = authService.protect;
exports.googleAuth = authService.googleAuth;
exports.googleAuthCallback = authService.googleAuthCallback;
exports.googleAuthSuccess = authService.googleAuthSuccess;
exports.forgotPassword = authService.forgotPassword;
exports.resetPassword = authService.resetPassword;