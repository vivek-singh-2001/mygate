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
    responsibleUser,
  } = visitorData;

  return await Visitor.create({
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
};

exports.getVisitors = async (filters) => {
  return await Visitor.findAll({
    where: filters,
  });
};
