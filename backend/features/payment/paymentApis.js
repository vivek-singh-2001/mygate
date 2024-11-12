const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");
const { bodyValidator } = require("../../validations/bodyValidation");

const paymentValidationRules = bodyValidator([
  { name: "ownerId", isRequired: true, type: "uuid" },
  { name: "houseId", isRequired: false, type: "uuid" },
  { name: "amount", isRequired: true, type: "int" },
  { name: "transactionId", isRequired: true, type: "string" },
  { name: "status", isRequired: true, type: "enum", enumValues: ["success", "failure","pending"] },
]);

const paymentIdValidationRules = bodyValidator([
  { name: "paymentId", isRequired: true, type: "uuid" },
]);

const getPaymentsByOwnerValidationRules = bodyValidator([
  { name: "ownerId", isRequired: true, type: "uuid" },
]);

router.post("/create",paymentValidationRules, paymentController.createPayment);
router.post('/verify-payment', paymentController.verifyPayment);
router.get("/payments/:paymentId",paymentIdValidationRules, paymentController.getPaymentById);
router.get("/user/:ownerId",getPaymentsByOwnerValidationRules, paymentController.getPaymentsForUser);
router.get("/all/:id", paymentController.getAllPayments);

module.exports = router;
