const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const visitorService = require("./visitorService");
const path = require('path');

exports.addVisitor = asyncErrorHandler(async (req, res, next) => {
  const visitorData = req.body;
  visitorData.image = path.join("/uploads/", req.file?.filename) || null;
  console.log(123, visitorData.image);
  
  const newVisitor = await visitorService.addVisitor(visitorData);
  return res.status(201).json({
    status: "success",
    message: "Visitor added successfully",
    data: newVisitor,
  });
});

exports.getVisitors = asyncErrorHandler(async (req, res, next) => {
  const { houseId, userId } = req.query;

  const visitors = await visitorService.getVisitors(houseId, userId);

  return res.status(200).json({
    status: "success",
    data: visitors,
  });
});

exports.verifyPasscode = asyncErrorHandler(async (req, res, next) => {
  const { passcode } = req.body;

  await visitorService.verifyPasscode(passcode);

  return res.status(200).json({
    status: "success",
    message: "Visitor verified",
  });
});

exports.approveVisitor = asyncErrorHandler(async (req, res, next) => {
  const { id: visitorId } = req.params;
  const { status } = req.body;

  if (!status || (status !== "Approved" && status !== "Rejected")) {
    res.status(400).json({
      message: "Status is required and must be either approved or rejected",
    });
  }

  const updatedVisitor = await visitorService.approveVisitor(visitorId, status);

  res.status(200).json({
    status: "success",
    data: updatedVisitor,
  });
});

exports.imagePath = (req, res) => {
  const filePath = path.join(__dirname, "../../uploads", req.params.filename);
  res.sendFile(filePath);
}

exports.getAllVisitors = asyncErrorHandler(async(req, res, next) => {
  const { id: societyId } = req.params;

  const data = await visitorService.getAllVisitors(societyId);

  res.status(200).json({
    status: "success",
    data
  })
})
