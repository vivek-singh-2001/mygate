const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const societyService = require("./societyService");
const CustomError = require("../../utils/CustomError");
const util = require("util");
const jwt = require("jsonwebtoken");
const { log } = require("console");

exports.registerSociety = asyncErrorHandler(async(req, res, next) => {
  // const {userDetails, societyDetails, }
})

exports.getUsersBySociety = asyncErrorHandler(async (req, res, next) => {
  const { id: societyId } = req.params;
  const { limits = 10, offsets = 0, searchQuery = "" } = req.query;

  if (!societyId) {
    return next(new CustomError("Society ID is required", 400));
  }

  try {
    const users = await societyService.getUsersBySociety(
      societyId,
      limits,
      offsets,
      searchQuery
    );
    res.status(200).json({
      status: "success",
      totalRecords: users[0].total_count,
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
    const users = await societyService.getUsersBySocietyAndWing(
      societyId,
      wingId
    );
    res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.getSocietyAdminsDetails = asyncErrorHandler(async (req, res, next) => {
  const { id: societyId } = req.params;
  if (!societyId) {
    return next(new CustomError("Society ID is required", 400));
  }

  try {
    const societyDetails = await societyService.getSocietyAdminsDetails(
      societyId
    );
    res.status(200).json({
      status: "success",
      length: societyDetails.length,
      societyDetails,
    });
  } catch (error) {
    next(error);
  }
});

exports.checkIsAdmin = asyncErrorHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = await societyService.isUserAdmin(userId);
    res.json({ isAdmin });
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
