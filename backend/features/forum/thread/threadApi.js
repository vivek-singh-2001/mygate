const express = require("express");
const router = express.Router();
const validate = require("../../../utils/validationMiddleware");
const { bodyValidator } = require("../../../validations/bodyValidation");
const { idValidationSchema } = require("../../../validations/idValidation");
const threadController = require("./threadController");
const {
  createThread,
  getThreadById,
  getAllThreads,
  updateThread,
  deleteThread,
} = threadController;

const threadValidationRules = bodyValidator([
  { name: "userId", isRequired: true, type: "uuid" },
  { name: "forumId", isRequired: true, type: "uuid" },
  { name: "title", isRequired: true, type: "string" },
  { name: "content", isRequired: true, type: "string" },
]);

router.post("/", validate(threadValidationRules), createThread);
router.get("/:id", validate(idValidationSchema), getThreadById);
router.get("/:id", validate(idValidationSchema), getAllThreads);
router.put("/:id", validate(idValidationSchema), updateThread);
router.delete("/:id", validate(idValidationSchema), deleteThread);

module.exports = router;
