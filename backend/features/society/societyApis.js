const express = require("express");
const societyController = require("./societyController");
const authController = require("../../middlewares/authentication");

const { protect } = authController;

const router = express.Router();

const { getUsersBySociety, getUsersBySocietyAndWing } = societyController;

// Define routes
router.get("/:societyId", protect, getUsersBySociety);
router.get("/:societyId/wing/:wingName", protect, getUsersBySocietyAndWing);

module.exports = router;
