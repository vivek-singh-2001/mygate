const express = require("express");
const router = express.Router();
const visitorController = require("./visitorController");
const validate = require("../../utils/validationMiddleware");
const { bodyValidator } = require("../../validations/bodyValidation");
const { idValidationSchema } = require("../../validations/idValidation");
const upload = require("../../middleware/multer");
const { patch } = require("../../app");
const path = require("path");

const { uploadSingle } = upload(/jpeg|jpg|png|webp/, "image");

const { addVisitor, getVisitors, verifyPasscode, approveVisitor, imagePath } =
  visitorController;

const visitorValidationRules = bodyValidator([
  { name: "name", isRequired: true, type: "string" },
  { name: "number", isRequired: true, type: "int" },
  { name: "vehicleNumber", isRequired: false, type: "string" },
  { name: "purpose", isRequired: true, type: "string" },
  { name: "startDate", isRequired: true, type: "date" },
  { name: "endDate", isRequired: true, type: "date" },
  { name: "visitTime", isRequired: true, type: "date" },
  {
    name: "type",
    isRequired: true,
    type: "enum",
    enumValues: ["Invited", "Uninvited"],
  },
  {
    name: "status",
    isRequired: false,
    type: "enum",
    enumValues: ["Pending", "Approved", "Rejected"],
  },
  { name: "houseId", isRequired: false, type: "uuid" },
  { name: "responsibleUser", isRequired: true, type: "uuid" },
]);

const passcodeValidationRules = bodyValidator([
  { name: "passcode", isRequired: true, type: "string" },
]);

router.get("/", getVisitors);
router.post("/add", uploadSingle, validate(visitorValidationRules), addVisitor);
router.post(
  "/verify-passcode",
  validate(passcodeValidationRules),
  verifyPasscode
);
router.patch("/approval/", validate(idValidationSchema), approveVisitor);
router.get("/image/:filename", imagePath);

module.exports = router;
