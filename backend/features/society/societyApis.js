const express = require("express");
const societyController = require("./societyController");
const authController = require("../../features/authentication/authController");

const { protect } = authController;

const router = express.Router();

const { getUsersBySociety, getUsersBySocietyAndWing,getSocietyByUserId } = societyController;

// Define routes
router.get("/:societyId", protect, getUsersBySociety);
router.get("/:societyId/wing/:wingName", protect, getUsersBySocietyAndWing);
// Route to get society by user ID
router.get("/societyDetails/details", protect, getSocietyByUserId);

module.exports = router;
