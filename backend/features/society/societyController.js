const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const societyService = require('./societyService');
const CustomError = require("../../utils/CustomError");

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
  const { societyId, wingName } = req.params;

  if (!societyId || !wingName) {
    return next(new CustomError("Society ID and Wing Name are required", 400));
  }

  try {
    const users = await societyService.getUsersBySocietyAndWing(societyId, wingName);
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
