const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const visitorService = require("./visitorService");

exports.addVisitor = asyncErrorHandler(async (req, res) => {
  const visitorData = req.body;
  const newVisitor = await visitorService.addVisitor(visitorData);
  return res.status(201).json({
    status: "success",
    message: "Visitor added successfully",
    data: newVisitor,
  });
});
