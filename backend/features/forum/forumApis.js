const express = require("express");
const router = express.Router();
const forumController = require("./forumController");

router.post("/create-forum", forumController.createForum);
router.get("/getAllForum/:id", forumController.getAllForums);
router.get("/getOneForum:id", forumController.getForumById);
router.put("/:id", forumController.updateForum);
router.delete("/:id", forumController.deleteForum);

module.exports = router;
