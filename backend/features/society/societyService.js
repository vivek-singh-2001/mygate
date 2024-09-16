const societyRepository = require('./societyRepository');
const CustomError = require("../../utils/CustomError");

exports.getUsersBySociety = async (societyId,limits,offsets,searchQuery ) => {
  const users = await societyRepository.findUsersBySociety(societyId,limits,offsets,searchQuery );
  if (users.length === 0) {
    throw new CustomError(`No users found for Society ID ${societyId}`, 404);
  }

  return users;
};

exports.getUsersBySocietyAndWing = async (societyId, wingId) => {
  const users = await societyRepository.findUsersBySocietyAndWing(societyId, wingId);
  if (users.length === 0) {
    throw new CustomError(`No users found for Society ID ${societyId} and Wing ${wingName}`, 404);
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

exports.isUserAdmin = async(userId)=>{
  const society = await societyRepository.findSocietyByUserId(userId);

  return society;

}

