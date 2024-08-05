const express = require("express");
const user_controller = require("../controller/user_controller");

const router = express.Router();

router.route("/").get(user_controller.getAllUser);

// router.route("/:societyId").get(user_controller.getUsersBySociety);

router.route("/:societyId/:wingName").get(user_controller.getUsersBySocietyAndWing);
router.route('/familyMembers/:userId').get(user_controller.getFamilyMembers)
router.route('/addFamilyMember').post(user_controller.addFamilyMember)
router.route('/updatePassword').patch(user_controller.updatePassword)

module.exports = router;
