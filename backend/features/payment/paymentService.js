const razorpayInstance = require("../../config/razorPay");
const paymentRepository = require("./paymentRepository");
const houseRepository = require("../house/houseRepository");
const CustomError = require("../../utils/CustomError");
const societyRepository = require("../society/societyRepository");
const { Op } = require("sequelize");

exports.makePayment = async (paymentId) => {
  try {
    const payment = await paymentRepository.getPaymentById(paymentId);
    if (!payment) {
      throw new CustomError("Invalid payment id. No record found", 404);
    }
    const order = await razorpayInstance.orders.create({
      amount: payment.amount * 100,
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
    });
    return await paymentRepository.makePayment(paymentId, order.id);
  } catch (error) {
    console.log("rqfwerwegwe", error);

    throw new Error("Error processing payment: " + error.message);
  }
};

exports.createOrder = async (societyId, amount, date, category) => {
  try {
    const houses = await houseRepository.getHousesBySocietyId(societyId);
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    for (const house of houses) {
      const ownerId = house.Users[0].id;

      // Check if an order for the specified month already exists
      const existingOrder = await paymentRepository.checkExistingOrder(
        house.id,
        ownerId,
        month,
        year,
        category
      );

      if (!existingOrder) {
        await paymentRepository.createOrder(
          house.id,
          ownerId,
          amount,
          date,
          category
        );
      } else {
        return `${category} for ${month} - ${year} is already requested to each houses. `;
      }
    }

    return houses;
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
  return await paymentRepository.updatePaymentStatus(order_id, status, details);
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

exports.getAllPaymentExpenses = async (societyId, filters) => {
  try {
    const { status, fromDate, toDate, type, purpose } = filters;
    const society = await societyRepository.getsocietyById(societyId);
    if (!society) {
      throw new CustomError("Society not found", 404);
    }

    const paymentFilter = {
      ...(status && { status }),
      ...(purpose && (purpose === 'Maintenance' ? { purpose } : { purpose: { [Op.not]: 'Maintenance' } })),
      ...(fromDate && { paymentDate: { [Op.gte]: new Date(fromDate) } }),
      ...(toDate && { paymentDate: { [Op.lte]: new Date(toDate) } }),
    };
    
    const [payments, expenses] = await Promise.all([
      paymentRepository.getAllPayments(societyId, paymentFilter),
      paymentRepository.getExpenses(societyId)
    ]);

    return [
      ...payments.map((payment) => ({
        amount: payment.amount,
        purpose: payment.purpose,
        date: payment.status === 'success' ? payment.paymentDate : payment.dueDate,
        paymentEntity: `${payment.House.Floor.Wing.name} - ${payment.House.house_no}`,
        type: 'Credit'
      })),
      ...expenses.map((expense) => ({
        amount: expense.amount,
        purpose: `${expense.category}: ${expense.description}`,
        date: expense.date,
        paymentEntity: `Society Management`,
        type: 'Debit'
      }))
    ];
  } catch (error) {
    console.error("Error fetching payment expenses:", error);
    throw new Error("Error fetching payment expenses: " + error.message);
  }
};
