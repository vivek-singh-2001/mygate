const { db } = require("../../config/connection");
const { Payment } = db;

exports.createPayment = async (paymentDetails) => {
  try {
    const newPayment = await Payment.create(paymentDetails);
    return newPayment;
  } catch (error) {
    throw new Error("Error creating payment: " + error.message);
  }
};

exports.updatePaymentStatus = async (orderId, status, details) => {
  return await Payment.update({ status, ...details }, { where: { orderId } });
};

exports.getPaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findOne({
      where: { id: paymentId },
    });
    return payment;
  } catch (error) {
    throw new Error("Error fetching payment: " + error.message);
  }
};

exports.getPaymentsForUser = async (ownerId) => {
  try {
    const payments = await Payment.findAll({
      where: { ownerId: ownerId },
    });
    return payments;
  } catch (error) {
    throw new Error("Error fetching payments for user: " + error.message);
  }
};

exports.getAllPayments = async () => {
  try {
    const payments = await Payment.findAll();
    return payments;
  } catch (error) {
    throw new Error("Error fetching all payments: " + error.message);
  }
};
