const paymentService = require("./paymentService");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/CustomError");

exports.makePayment = asyncErrorHandler(async (req, res, next) => {
  const {paymentId} = req.body;

  const newPayment = await paymentService.makePayment(paymentId);
  return res.status(201).json({ success: true, data: newPayment });
});

exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  const maintenanceData = req.body;
  const { societyId, amount, date ,category} = maintenanceData;
  
  const newOrder = await paymentService.createOrder(societyId, amount, date,category);
  return res.status(201).json({ success: true,count:newOrder.length, data: newOrder });
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
        paymentDate: Date.now()
      });

      res.status(200).json({
        success: true,
        message: "Payment verified and recorded successfully",
      });
    } else {
      await paymentService.updatePaymentStatus(razorpay_order_id, "pending");
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
  return res.status(200).json({
    success: true,
    data: payment,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
  });
});

exports.getPaymentsForUser = asyncErrorHandler(async (req, res, next) => {
  const { id: ownerId } = req.params;
  const payments = await paymentService.getPaymentsForUser(ownerId);
  return res.status(200).json({ success: true, data: payments });
});

exports.getAllPayments = asyncErrorHandler(async (req, res, next) => {
  const { id: societyId } = req.params;
  const { status = 'success', fromDate, toDate, type, purpose } = req.query;
  const payments = await paymentService.getAllPaymentExpenses(societyId, { status, fromDate, toDate, type, purpose });
  return res.status(200).json({ success: true, data: payments });
});

exports.addExpense = asyncErrorHandler ( async(req,res,next)=>{
  const {amount,date,category,description,societyId} = req.body
  
  const newExpanse = await paymentService.addExpense(amount,date,category,description,societyId)

  return res.status(200).json({ success: true, data: newExpanse });
  
})
