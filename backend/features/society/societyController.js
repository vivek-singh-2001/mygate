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


// Get society by user ID
exports.getSocietyByUserId = asyncErrorHandler(async (req, res, next) => {
  const { jwtToken } = req.cookies;
  const decodedToken = await util.promisify(jwt.verify)(
    jwtToken,
    process.env.JWT_SECRET
  );

  const userId = decodedToken.id
  console.log("userId", userId);
  const society = await societyService.getSocietyByUserId(userId);

  if (!society) {
    return next(new CustomError('Society not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { society },
  });
});
