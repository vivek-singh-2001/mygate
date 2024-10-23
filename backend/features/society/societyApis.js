const express = require("express");
const societyController = require("./societyController");
const authController = require("../../features/authentication/authController");
const { protect } = authController;

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

const {
  getUsersBySociety,
  getUsersBySocietyAndWing,
  getSocietyAdminsDetails,
  registerSociety,
  getSocieties,
  getCsvFile,
  createSociety,
  rejectSociety,
  checkIsAdmin
} = societyController;

// Define routes
router.get("/:id", protect, getUsersBySociety);
router.get("/a/b/c/d/allSocieties",protect,getSocieties)
router.get("/csv/:filename",protect,getCsvFile)
router.post("/registerSociety", upload.single('file'),registerSociety);
router.get("/:societyId/wing/:wingId", protect, getUsersBySocietyAndWing);
router.get("/societyAdminsDetails/:id", getSocietyAdminsDetails);
router.post("/createSociety",protect,createSociety)
router.post("/rejectSociety",protect,rejectSociety)
router.get("/checkAdmin/isAdmin", protect, checkIsAdmin);
module.exports = router;
