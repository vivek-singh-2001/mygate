const express = require("express");
const userController = require("./userController");

const { getUserById, updateUser, getFamilyMembers, addFamilyMember, updatePassword } = userController;

const router = express.Router();

// Define routes
router.get("/updateUser/:id", getUserById).patch(updateUser);
router.get("/familyMembers/:userId", getFamilyMembers);
router.post("/addFamilyMember", addFamilyMember);
router.patch("/updatePassword", updatePassword);

module.exports = router;