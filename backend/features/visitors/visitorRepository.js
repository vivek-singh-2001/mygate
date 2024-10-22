const { db } = require("../../config/connection");
const { Visitor } = db;
const CustomError = require("../../utils/CustomError");

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

exports.findByPasscode = async (passcode) => {
  return await Visitor.findOne({
    where: { passcode },
  });
};

exports.findById = async (visitorId) => {
  return await Visitor.findOne({
    where: { id: visitorId },
  });
};

exports.updateVisitorStatus = async (visitorId, status) => {
  try {
    const [rowsUpdated, [updatedVisitor]] = await Visitor.update(
      { status },
      {
        where: { id: visitorId },
        returning: true,
      }
    );

    if (rowsUpdated === 0) {
      return null;
    }

    return updatedVisitor;
  } catch (error) {
    console.log(error);
    throw new CustomError(error);
  }
};
