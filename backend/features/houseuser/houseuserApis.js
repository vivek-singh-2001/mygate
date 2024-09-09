const express = require("express");
const authController = require('../../features/authentication/authController')
const houseuserController = require('../../features/houseuser/houseusersController')

const {protect} = authController

const { getHouseDetails} = houseuserController

const router = express.Router();

// Define routes
router.route("/houseDetails/:houseId").get(protect,getHouseDetails)


module.exports = router;