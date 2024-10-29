const { db } = require("../../config/connection");
const { Visitor, House, Floor, Wing, User } = db;
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
    image,
  } = visitorData;

  return await Visitor.create({
    name,
    number,
    vehicleNumber: vehicleNumber || null,
    purpose: purpose || "Visit",
    startDate,
    endDate,
    visitTime,
    passcode: passcode || null,
    type,
    status: status || "Pending",
    houseId: houseId || null,
    responsibleUser: responsibleUser,
    image: image || null,
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

exports.getAllVisitors = async (societyId) => {
  return await Visitor.findAll({
    where: { type: "Uninvited" },
    include: [
      {
        model: House,
        required: true,
        include: [
          {
            model: Floor,
            required: true,
            include: [
              {
                model: Wing,
                required: true,
                where: { societyId: societyId },
              },
            ],
          },
        ],
      },
      {
        model: User,
      }
    ],
  });
};