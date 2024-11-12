const paymentService = require("./paymentService");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/CustomError");

exports.createPayment = asyncErrorHandler(async (req, res, next) => {
  const paymentDetails = req.body;

  const newPayment = await paymentService.createPayment(paymentDetails);
  return res.status(201).json({ success: true, data: newPayment });
});

exports.verifyPayment = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  try {
    const isVerified = await paymentService.verifyPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );

    if (isVerified) {
      await paymentService.updatePaymentStatus(razorpay_order_id, "success", {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      res
        .status(200)
        .json({
          success: true,
          message: "Payment verified and recorded successfully",
        });
    } else {
      await paymentService.updatePaymentStatus(razorpay_order_id, "failure");

      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentById = asyncErrorHandler(async (req, res, next) => {
  const { paymentId } = req.params;
  const payment = await paymentService.getPaymentById(paymentId);
  if (!payment) {
    return res
      .status(404)
      .json({ success: false, message: "Payment not found" });
  }
  return res
    .status(200)
    .json({
      success: true,
      data: payment,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
});

exports.getPaymentsForUser = asyncErrorHandler(async (req, res, next) => {
  const { ownerId } = req.params;
  const payments = await paymentService.getPaymentsForUser(ownerId);
  return res.status(200).json({ success: true, data: payments });
});

exports.getAllPayments = asyncErrorHandler(async (req, res, next) => {
  const payments = await paymentService.getAllPayments();
  return res.status(200).json({ success: true, data: payments });
});
