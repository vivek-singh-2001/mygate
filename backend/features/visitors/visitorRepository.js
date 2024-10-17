const { db } = require("../../config/connection");
const { Visitor } = db;

exports.createVisitor = async (visitorData) => {
  const {
    name,
    number,
    vehicleNumber,
    purpose,
    startDate,
    endDate,
    visitTime,
    passcode,
    type,
    houseId,
    status,
    responsibleUser
  } = visitorData;

  try {
    const newVisitor = await Visitor.create({
      name,
      number,
      vehicleNumber: vehicleNumber || null,
      purpose: purpose || "Visit",
      startDate,
      endDate,
      visitTime,
      passcode,
      type,
      status,
      houseId: houseId || null,
      responsibleUser: responsibleUser,
    });

    return newVisitor;
  } catch (error) {
    console.error("Error in creating new visitor:", error);
    throw new Error("Error creating visitor in the database");
  }
};
