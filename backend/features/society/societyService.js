const societyRepository = require('./societyRepository');
const CustomError = require("../../utils/CustomError");

exports.getUsersBySociety = async (societyId) => {
  const users = await societyRepository.findUsersBySociety(societyId);
  if (users.length === 0) {
    throw new CustomError(`No users found for Society ID ${societyId}`, 404);
  }
  return users;
};

exports.getUsersBySocietyAndWing = async (societyId, wingName) => {
  const users = await societyRepository.findUsersBySocietyAndWing(societyId, wingName);
  if (users.length === 0) {
    throw new CustomError(`No users found for Society ID ${societyId} and Wing ${wingName}`, 404);
  }
  return users;
};



// Get society by user ID
exports.getSocietyByUserId = async (userId) => {
  return societyRepository.getSocietyByUserId(userId);
};
