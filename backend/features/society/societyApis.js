const express = require("express");
const societyController = require("./societyController");
const authController = require("../../features/authentication/authController");
const { protect } = authController;

const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Add timestamp to the filename
  },
});

const upload = multer({ storage: storage });

const router = express.Router();


const {
  getUsersBySociety,
  getUsersBySocietyAndWing,
  getSocietyAdminsDetails,
  checkIsAdmin,
  registerSociety,
} = societyController;

// Define routes
router.get("/:id", protect, getUsersBySociety);
router.post("/registerSociety", upload.single('file'),registerSociety);
router.get("/:societyId/wing/:wingId", protect, getUsersBySocietyAndWing);
router.get("/societyAdminsDetails/:id", getSocietyAdminsDetails);
router.get("/checkAdmin/isAdmin", protect, checkIsAdmin);
module.exports = router;
