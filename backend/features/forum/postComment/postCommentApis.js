const express = require("express");
const router = express.Router();
const commentController = require("./postCommentController");
const upload = require("../../../middleware/multer");
const { bodyValidator } = require("../../../validations/bodyValidation");
const validate = require("../../../utils/validationMiddleware");

const commentValidationRules = bodyValidator([
  { name: "content", isRequired: true, type: "string" },
  { name: "postId", isRequired: true, type: "uuid" },
  { name: "userId", isRequired: true, type: "uuid" },
]);

const { uploadSingle } = upload(/jpg|jpeg|png|webp/, "file");

router.post(
  "/",
  uploadSingle,
  validate(commentValidationRules),
  commentController.createComment
);
router.get("/:id", commentController.getCommentById);
router.get("/post/:postId", commentController.getCommentsByPostId);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
