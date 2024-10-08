const express = require("express");
const userController = require("./userController");
const authController = require('../../features/authentication/authController')

const {protect} = authController

const { getUserById, updateUser, getFamilyMembers, addFamilyMember, updatePassword,deleteUser } = userController;

const router = express.Router();

// Define routes
router.route("/getUser/me").get(protect,getUserById);
router.route("/updateUser/:id").patch(protect,updateUser);
router.get("/familyMembers/:userId/:houseId", protect,getFamilyMembers);
router.post("/addFamilyMember", protect,addFamilyMember);
router.patch("/updatePassword",protect, updatePassword);
router.delete("/deleteuser",protect,deleteUser)

module.exports = router;