const express = require("express");
const authController = require('../../features/authentication/authController')
const wingController = require('../../features/wing/wingController')

const {protect} = authController

const { getWingDetails} = wingController

const router = express.Router();

// Define routes
router.route("/wingDetails/:id").get(protect,getWingDetails)

module.exports = router;