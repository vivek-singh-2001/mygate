const express = require("express");
const societyController = require("./societyController");
const authController = require("../../features/authentication/authController");

const { protect } = authController;

const router = express.Router();

const { getUsersBySociety, getUsersBySocietyAndWing ,getSocietyAdminsDetails, checkIsAdmin} = societyController;

// Define routes
router.get("/:societyId", protect, getUsersBySociety);
router.get("/:societyId/wing/:wingId", protect, getUsersBySocietyAndWing);
router.get("/societyAdminsDetails/:societyId",getSocietyAdminsDetails);
router.get("/checkAdmin/isAdmin",protect,checkIsAdmin);
module.exports = router;
