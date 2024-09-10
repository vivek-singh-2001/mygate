const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const societyService = require('./societyService');
const CustomError = require("../../utils/CustomError");
const util = require('util');
const jwt = require("jsonwebtoken");

exports.getUsersBySociety = asyncErrorHandler(async (req, res, next) => {
  const { societyId } = req.params;

  if (!societyId) {
    return next(new CustomError("Society ID is required", 400));
  }

  try {
    const users = await societyService.getUsersBySociety(societyId);
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.getUsersBySocietyAndWing = asyncErrorHandler(async (req, res, next) => {
  const { societyId, wingId } = req.params;

  if (!societyId || !wingId) {
    return next(new CustomError("Society ID and Wing Name are required", 400));
  }

  try {
    const users = await societyService.getUsersBySocietyAndWing(societyId, wingId);
    res.status(200).json({
      status: "success",
      length:users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.getSocietyAdminsDetails = asyncErrorHandler(async (req, res, next) =>{
  const {societyId} =  req.params;
  if (!societyId ) {
    return next(new CustomError("Society ID is required", 400));
  }

  try {
    const users = await societyService.getSocietyAdminsDetails(societyId);
    res.status(200).json({
      status: "success",
      length:users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }

})

