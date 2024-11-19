const { db } = require("../../config/connection");
const { Payment, House, Floor, Wing, User, SocietyExpense } = db;
const { Op } = require("sequelize");

exports.makePayment = async (paymentId, orderId) => {
  try {
    const updatedPayments = await Payment.update(
      { orderId },
      { where: { id: paymentId }, returning: true }
    );

    return updatedPayments[1][0];
  } catch (error) {
    throw new Error("Error creating payment: " + error.message);
  }
};

exports.createOrder = async (houseId, ownerId, amount, date, category) => {
  
  try {
    const newPayment = await Payment.create({
      ownerId: ownerId,
      houseId: houseId,
      amount: amount,
      purpose: category,
      dueDate: date,
      status: "pending",
    });
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

exports.checkExistingOrder = async (
  houseId,
  ownerId,
  month,
  year,
  category
) => {
  return Payment.findOne({
    where: {
      houseId,
      ownerId,
      purpose: category,
      dueDate: {
        [Op.between]: [new Date(year, month - 1, 1), new Date(year, month, 0)],
      },
    },
  });
};

exports.getAllPayments = async (societyId, paymentFilters) => {
  try {
    return await Payment.findAll({
      where: { ...paymentFilters },
      attributes: ["amount", "purpose", "dueDate", "status", "paymentDate"],
      include: [
        {
          model: House,
          required: true,
          attributes: ["house_no"],
          include: [
            {
              model: Floor,
              required: true,
              attributes: ["floor_number"],
              include: [
                {
                  model: Wing,
                  required: true,
                  attributes: ["name"],
                  where: { societyId },
                },
              ],
            },
          ],
        },
        // {
        //   model: User,
        //   required: true,
        //   attributes: ['firstname', 'lastname', 'number', 'email','photo']
        // },
      ],
    });
  } catch (error) {
    console.log("Error fetching payments:", error);
    throw new Error("Error fetching all payments: " + error.message);
  }
};

exports.getExpenses = async (societyId, expenseFilters) => {
  try {
    return await SocietyExpense.findAll({
      where: { societyId, ...expenseFilters },
      attributes: ["date", "amount", "category", "description", "status"],
    });
  } catch (error) {
    console.log("Error fetching expenses:", error);
    throw new Error("Error fetching all payments: " + error.message);
  }
};

exports.getTotalIncome = async (societyId) => {
  try {
    return await Payment.sum("amount", {
      where: { status: "success" },
      include: [
        {
          model: House,
          required: true,
          attributes: [], // Exclude all columns from House
          include: [
            {
              model: Floor,
              attributes: [], // Exclude all columns from Floor
              include: [
                {
                  model: Wing,
                  attributes: [], // Exclude all columns from Wing
                  where: { societyId },
                },
              ],
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching total income:", error);
    throw new Error("Error fetching total income: " + error.message);
  }
};

exports.getTotalExpenses = async (societyId) => {
  try {
    return await SocietyExpense.sum("amount", {
      where: { societyId, status: "approved" },
    });
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    throw new Error("Error fetching total expenses: " + error.message);
  }
};

exports.addExpense = async(amount,date,category,description,societyId)=>{
  try {
    return await SocietyExpense.create({
      societyId:societyId,
      date:date,
      amount,
      category,
      description,
      status:'approved',
      attachment:imagePath
    });
  } catch (error) {
    console.log("Error fetching expenses:", error);
    throw new Error("Error fetching all payments: " + error.message);
  }
}
