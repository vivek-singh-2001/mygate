const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");
const { bodyValidator } = require("../../validations/bodyValidation");
const validate = require("../../utils/validationMiddleware");

const paymentValidationRules = bodyValidator([
  { name: "societyId", isRequired: true, type: "uuid" },
  { name: "date", isRequired: false, type: "date" },
  { name: "amount", isRequired: true, type: "int" },
  { name: "category", isRequired: true, type:"string" },
]);

const paymentIdValidationRules = bodyValidator([
  { name: "paymentId", isRequired: true, type: "uuid" },
]);

router.post("/create",validate(paymentValidationRules), paymentController.createOrder);
router.post("/", validate(paymentIdValidationRules),paymentController.makePayment);
router.post('/verify-payment', paymentController.verifyPayment);
router.get("/payments/:paymentId",validate(paymentIdValidationRules), paymentController.getPaymentById);
router.get("/user/:id", paymentController.getPaymentsForUser);
router.get("/all/:id", paymentController.getAllPayments);

module.exports = router;
