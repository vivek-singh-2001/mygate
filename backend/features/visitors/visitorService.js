const visitorRepository = require("./visitorRepository");
const houseRepository = require("../house/houseRepository");
const userRepository = require("../users/userRepository");
const CustomError = require("../../utils/CustomError");

const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const extractTime = (date) => {
  return date.toTimeString().split(" ")[0];
};

exports.addVisitor = async (visitorData) => {
  const now = new Date();
  const currentDate = new Date(now.setHours(0, 0, 0, 0));
  const visitStartDate = new Date(visitorData.startDate);
  const visitEndDate = new Date(visitorData.endDate);

  if (visitStartDate < currentDate) {
    throw new CustomError("Visit start date cannot be in the past", 400);
  }

  if (visitEndDate < visitStartDate) {
    throw new CustomError(
      "Visit end date must be after or equal to start date",
      400
    );
  }

  if (visitStartDate.toDateString() === currentDate.toDateString()) {
    const visitTime = new Date(
      `${visitorData.visit_start_date}T${visitorData.visitTime}`
    );

    if (visitTime < now) {
      throw new CustomError("Visit time cannot be in the past", 400);
    }
  }

  const passcode = visitorData.type === "Invited" ? generatePasscode() : null;

  return await visitorRepository.createVisitor({
    ...visitorData,
    passcode,
    visitTime: extractTime(new Date(visitorData.visitTime)),
  });
};

exports.getVisitors = async (houseId, userId) => {
  if (!houseId && !userId) {
    throw new CustomError("Please provide houseId or userId", 400);
  }

  const filters = {};

  if (houseId) {
    const house = await houseRepository.findById(houseId);
    if (!house) {
      throw new CustomError("Invalid houseId", 400);
    }
    filters.houseId = houseId;
  } else if (userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new CustomError("Invalid userId", 400);
    }
    filters.responsibleUser = userId;
  }

  return await visitorRepository.getVisitors(filters);
};

exports.verifyPasscode = async (passcode) => {
  if (passcode.length !== 6) {
    throw new CustomError("Invalid passcode", 404);
  }

  const visitor = await visitorRepository.findByPasscode(passcode);

  if (!visitor) {
    throw new CustomError("Invalid passcode", 404);
  }

  return visitor;
};
