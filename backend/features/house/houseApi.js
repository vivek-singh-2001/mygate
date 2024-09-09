const express = require("express");
const authController = require('../../features/authentication/authController')
const houseController = require('../../features/house/houseController')

const {protect} = authController

const { getWingHouseDetails} = houseController

const router = express.Router();

// Define routes
router.route("/wingHouseDetails/:wingId").get(protect,getWingHouseDetails)


module.exports = router;