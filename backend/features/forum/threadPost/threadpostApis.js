const express = require("express");
const router = express.Router();
const postController = require("./threadPostController");
const upload = require("../../../middleware/multer");
const validate = require("../../../utils/validationMiddleware");
const { bodyValidator } = require("../../../validations/bodyValidation");

const postValidationRules = bodyValidator([
  { name: "content", isRequired: true, type: "string" },
  { name: "threadId", isRequired: true, type: "uuid" },
  { name: "userId", isRequired: true, type: "uuid" },
]);

const { uploadSingle } = upload(/jpg|jpeg|png|webp/, "file");

router.post(
  "/",
  uploadSingle,
  validate(postValidationRules),
  postController.createPost
);
router.get("/:id", postController.getPostById);
router.get("/thread/:threadId", postController.getPostsByThreadId);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
