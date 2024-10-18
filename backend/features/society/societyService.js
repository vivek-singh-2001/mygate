const societyRepository = require("./societyRepository");
const CustomError = require("../../utils/CustomError");
const userRepository = require("../users/userRepository");
const { parseCsvFile } = require("../../utils/csvFileParse");

exports.getUsersBySociety = async (societyId, limits, offsets, searchQuery) => {
  const users = await societyRepository.findUsersBySociety(
    societyId,
    limits,
    offsets,
    searchQuery
  );
  if (users.length === 0) {
    throw new CustomError(`No users found for Society ID ${societyId}`, 404);
  }

  return users;
};

exports.getUsersBySocietyAndWing = async (societyId, wingId) => {
  const users = await societyRepository.findUsersBySocietyAndWing(
    societyId,
    wingId
  );
  if (users.length === 0) {
    throw new CustomError(
      `No users found for Society ID ${societyId} and Wing ${wingName}`,
      404
    );
  }
  return users;
};

exports.getSocietyAdminsDetails = async (societyId) => {
  const users = await societyRepository.findSocietyAdminsDetails(societyId);

  if (users.length === 0) {
    throw new CustomError(`No users found for Society ID ${societyId} `, 404);
  }
  return users;
};

exports.isUserAdmin = async (userId) => {
  const society = await societyRepository.findSocietyByUserId(userId);
  return society;
};

exports.registerSociety = async (societyDetails) => {
  const result = await societyRepository.registerSociety({
    societyDetails,
    status: "pending",
  });
  return result;
};

exports.getSocieties = async (status) => {
  const result = await societyRepository.getAllSocieties(status);
  return result;
};

exports.createSociety = async (csvData, societyId, userId, next) => {
  const wingsArray = await parseCsvFile(csvData);
  if (!wingsArray) {
    return next(new CustomError("somethng wrong with csvFile", 400));
  }

  const result = await societyRepository.createSociety(
    wingsArray,
    societyId,
    userId
  );
  return result;
};

exports.rejectSociety = async (societyId, userId) => {
  try {
    await userRepository.deleteUser(userId);

    await societyRepository.updateSocietyStatus(societyId, "rejected");

    return { message: "Society rejected and user deleted successfully" };
  } catch (error) {
    console.error("Error in rejecting society:", error);
    throw new Error(
      "Failed to reject society and delete user. Please try again."
    );
  }
};
