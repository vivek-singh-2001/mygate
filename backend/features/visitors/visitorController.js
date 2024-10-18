const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const visitorService = require("./visitorService");

exports.addVisitor = asyncErrorHandler(async (req, res, next) => {
  const visitorData = req.body;
  const newVisitor = await visitorService.addVisitor(visitorData);
  return res.status(201).json({
    status: "success",
    message: "Visitor added successfully",
    data: newVisitor,
  });
});

exports.getVisitors = async (req, res) => {
  const { houseId, userId } = req.query;

  const visitors = await visitorService.getVisitors(houseId, userId);

  return res.status(200).json({
    status: "success",
    data: visitors,
  });
};
