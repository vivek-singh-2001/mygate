const express = require("express");
const router = express.Router();
const visitorController = require("./visitorController");
const validate = require("../../utils/validationMiddleware");
const { bodyValidator } = require("../../validations/bodyValidation");

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

const { addVisitor } = visitorController;

router.post("/add", validate(visitorValidationRules), addVisitor);

module.exports = router;