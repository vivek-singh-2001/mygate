const express = require('express');
const user_controller = require('../controller/user_controller');

const router = express.Router()

router
    .route('/')
    .get(user_controller.getAllUser)


module.exports = router;