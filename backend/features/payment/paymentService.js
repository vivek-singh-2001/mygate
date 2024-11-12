const razorpayInstance = require("../../config/razorPay");
const paymentRepository = require("./paymentRepository");

exports.createPayment = async (paymentDetails) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: paymentDetails.amount * 100,
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
    });
    return await paymentRepository.createPayment({
      ...paymentDetails,
      orderId: order.id,
      status: "pending",
    });
  } catch (error) {
    console.log("rqfwerwegwe", error);
    
    throw new Error("Error processing payment: " + error.message);
  }
};

exports.verifyPayment = async (
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature
) => {
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  return hash === razorpay_signature;
};

exports.updatePaymentStatus = async (order_id, status, details) => {
  return await paymentRepository.updatePaymentStatus(order_id, status, details)
};

exports.getPaymentById = async (paymentId) => {
  try {
    const payment = await paymentRepository.getPaymentById(paymentId);
    return payment;
  } catch (error) {
    throw new Error("Error fetching payment: " + error.message);
  }
};

exports.getPaymentsForUser = async (ownerId) => {
  try {
    const payments = await paymentRepository.getPaymentsForUser(ownerId);
    return payments;
  } catch (error) {
    throw new Error("Error fetching payments for user: " + error.message);
  }
};

exports.getAllPayments = async () => {
  try {
    const payments = await paymentRepository.getAllPayments();
    return payments;
  } catch (error) {
    throw new Error("Error fetching all payments: " + error.message);
  }
};
