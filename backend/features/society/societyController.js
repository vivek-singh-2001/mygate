const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { db } = require("../../config/connection");
const { User } = db;
const societyService = require("./societyService");
const CustomError = require("../../utils/CustomError");
const path = require("path");

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
      length: users.lengetSocietiesgth,
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
  console.log(societyId);

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
      data: societyDetails,
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

exports.registerSociety = asyncErrorHandler(async (req, res, next) => {
  const societyDetails = req.body.society ? JSON.parse(req.body.society) : null;
  const csvFile = req.file;

  if (!societyDetails || !csvFile) {
    return next(
      new CustomError("Society details or CSV file is missing.", 400)
    );
  }

  // Check if the user is already registered
  const existingUser = await User.findOne({
    where: { email: societyDetails.email },
  });
  if (existingUser) {
    return next(
      new CustomError("User already registered with this email address", 400)
    );
  }

  const csvFilePath = path.join(__dirname, "../../uploads/", csvFile.filename);
  societyDetails.filePath = csvFilePath;

  // Register the society
  const result = await societyService.registerSociety(societyDetails);

  res.status(200).json({ status: "success", societyDetails: result });
});

exports.getSocieties = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.query;

  const society = await societyService.getSocieties(status);
  if (!society) {
    return next(new CustomError("societies not found", 404));
  }

  res.status(200).json({ status: "success", length: society.length, society });
});

exports.getCsvFile = asyncErrorHandler(async (req, res, next) => {
  const filename = req.params.filename;
  console.log(filename);

  const filePath = path.join(__dirname, "../../uploads", filename);
  console.log(filePath);

  if (!filePath) {
    return next(new CustomError("society Data not found", 404));
  }

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file: ", err);
      res.status(404).send("File not found");
    }
  });
});

exports.createSociety = asyncErrorHandler(async (req, res, next) => {
  const societyData = req.body;
  const { csvData: csvFile, id: societyId } = societyData;
  const userId = societyData.User.id;
 


  if (!csvFile) {
    return next(new CustomError("csvFile not found!", 404));
  }

  if (!societyData.status == "pending") {
    return next(new CustomError("society is not in pending state", 400));
  }

  const response = await societyService.createSociety(csvFile, societyId,userId,next);

  if (!response) {
    return next(new CustomError("unable to create society", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Society approved and details created successfully.",
    societyDetails: response,
  });
});

exports.rejectSociety = asyncErrorHandler(async (req, res, next) => {
  const societyData = req.body;
  const { id: societyId, societyAdminId: userId, status } = societyData;
  
  if (!status == "pending") {
    return next(new CustomError("Society is not in pending state", 400));
  }
  if (!(userId && societyId)) {
    return next(new CustomError("Society or user not found", 400));
  }

  const response = await societyService.rejectSociety(societyId, userId);

  // Send a success response to the client
  res.status(200).json({
    status: "success",
    message: "Society rejected and society admin deleted successfully",
    data: response,
  });
});
