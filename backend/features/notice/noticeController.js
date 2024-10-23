const NoticeService = require("./noticeService");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const CustomError = require("../../utils/CustomError");

exports.createNotice = asyncErrorHandler(async (req, res, next) => {
    const noticeData = req.body;
    const images = req.files;
  
    // Validate the input
    if (!noticeData.description || !noticeData.societyId || !noticeData.userId) {
      return next(new CustomError('Missing required fields: description, societyId, or userId.', 400));
    }
    const newNotice = await NoticeService.createNotice(noticeData, images);
    return res.status(201).json({
      status: "success",
      message: "Notice created successfully",
      data: {
        newNotice,
      },
    });
  });
  
  
exports.getAllNotice = asyncErrorHandler(async (req, res, next) => {
  const { societyId } = req.params;

  const noticeList = await NoticeService.getAllNotice(societyId);
  if (!noticeList) {
    return next(new CustomError("Notice list doesnt found"));
  }
  res.status(200).json({ status: "success",data:{noticeList} });
});

exports.getNoticeById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const Notice = await NoticeService.getNoticeById(id);

  if (!Notice) {
    return next(new CustomError("Notice not found", 404));
  }

  res.status(200).json({ status: "success", data: Notice });
});

exports.updateNotice = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedNotice = await NoticeService.updateNotice(id, updatedData);

  if (!updatedNotice[0]) {
    return next(new CustomError("Failed to update Notice", 400));
  }

  res
    .status(200)
    .json({ status: "success", message: "Notice updated successfully" });
});

exports.deleteNotice = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  await NoticeService.deleteNotice(id);
  res
    .status(204)
    .json({ status: "success", message: "Notice deleted successfully" });
});
