const express = require("express");
const user_controller = require("../controller/user_controller");
const authController = require("../middlewares/authentication");

const router = express.Router();

router.route("/updateUser/:id")
    .get(user_controller.getUserById)
    .patch(authController.protect,user_controller.updateUser)

router.route('/familyMembers/:userId').get(user_controller.getFamilyMembers)
router.route('/addFamilyMember').post(user_controller.addFamilyMember)
router.route('/updatePassword').patch(user_controller.updatePassword)

module.exports = router;
