const express = require("express");
const societyController = require("./societyController");
const authController = require("../../features/authentication/authController");
const { protect } = authController;
const upload = require('../../middleware/multer');

const router = express.Router();

const { uploadSingle } = upload(/csv|xlsx|xls/,"file");

const {
  getUsersBySociety,
  getUsersBySocietyAndWing,
  getSocietyAdminsDetails,
  registerSociety,
  getSocieties,
  getCsvFile,
  createSociety,
  rejectSociety,
  checkIsAdmin,
  getStaffDetails

} = societyController;

router.get("/:id", protect, getUsersBySociety);
router.get("/a/b/c/d/allSocieties",protect,getSocieties)
router.get("/csv/:filename",protect,getCsvFile)
router.post("/registerSociety", uploadSingle,registerSociety);
router.get("/:societyId/wing/:wingId", protect, getUsersBySocietyAndWing);
router.get("/societyAdminsDetails/:id", getSocietyAdminsDetails);
router.post("/createSociety",protect,createSociety)
router.post("/rejectSociety",protect,rejectSociety)
router.get("/checkAdmin/isAdmin", protect, checkIsAdmin);
router.get("/getStaffDetails/:userId", protect, getStaffDetails);

module.exports = router;