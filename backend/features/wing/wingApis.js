const express = require("express");
const authController = require('../../features/authentication/authController')
const wingController = require('../../features/wing/wingController')

const {protect} = authController

const { getWingDetils,getAllWing} = wingController

const router = express.Router();

// Define routes
router.route("/wingDetails/:wingId").get(protect,getWingDetils)
// router.route("/getAllWings").post(protect,getAllWing)


module.exports = router;