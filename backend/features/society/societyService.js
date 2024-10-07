const societyRepository = require("./societyRepository");
const CustomError = require("../../utils/CustomError");
const csv = require("csv-parser");
const fs = require("fs");
const {parseCsvFile} = require("../../utils/csvFileParse");

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
  const result = await societyRepository.registerSociety({societyDetails,status:'pending'});  
  return result;
};

exports.getSocieties = async (status)=>{
  const result = await societyRepository.getAllSocieties(status);
  return result;
}



exports.createSociety = async (csvData, societyId,next) => {

  const wingsArray =  await parseCsvFile(csvData);
  
  const result = await societyRepository.createSociety(wingsArray,societyId);
  return result;
};




