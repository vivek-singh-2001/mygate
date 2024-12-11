const express = require("express");
const router = express.Router();
const postLikeController = require("./postLikeController");

router.post("/", postLikeController.likePost);

module.exports = router;
