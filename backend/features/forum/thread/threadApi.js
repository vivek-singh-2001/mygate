const express = require("express");
const router = express.Router();
const { param } = require('express-validator');
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

const upload = require("../../../middleware/multer")
const {uploadMultiple} = upload(/csv|jpg|jpeg|png|webp/,"files",3);

const threadValidationRules = bodyValidator([
  { name: "title", isRequired: true, type: "string" },
  { name: "content", isRequired: true, type: "string" },
  { name: "forumType", isRequired: true, type: "string" },
  { name: "userId", isRequired: true, type: "uuid" },
]);

const societyThreadValidationRules = bodyValidator([
  { name: "forumName", isRequired: true, type: "string" },
  { name: "societyId", isRequired: true, type: "uuid" },
]);


const validateFiles = (req, res, next) => {
  if ( req.files.length >3 ) {
    return res.status(400).json({ error: "At most three file must be uploaded." });
  }
  next();
};

router.post("/",  uploadMultiple,validate(threadValidationRules),validateFiles, createThread);
router.get("/:id", validate(idValidationSchema), getThreadById);
router.post("/societyThread", validate(societyThreadValidationRules), getAllThreads);
router.put("/:id", validate(idValidationSchema), updateThread);
router.delete("/:id", validate(idValidationSchema), deleteThread);

module.exports = router;
