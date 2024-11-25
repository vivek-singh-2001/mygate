const { log } = require("util");
const asyncErrorHandler = require("../../../utils/asyncErrorHandler");
const threadService = require("./threadService");

exports.createThread = asyncErrorHandler(async (req, res, next) => {
  const threadData = req.body;
  const attachments = req.files;

  const thread = await threadService.createThread(threadData, attachments);
  res.status(201).json({
    success: true,
    message: "Thread created successfully",
    data: thread,
  });
});

exports.getThreadById = asyncErrorHandler(async (req, res, next) => {
  const { id: threadId } = req.params;
  const thread = await threadService.getThreadById(threadId);
  res.status(200).json({ success: true, data: thread });
});

exports.getAllThreads = asyncErrorHandler(async (req, res, next) => {
  const { forumName, societyId } = req.body;

  const threads = await threadService.getAllThreads(forumName,societyId);
  res.status(200).json({ status:'success',data: threads });
});

exports.updateThread = asyncErrorHandler(async (req, res, next) => {
  const { id: threadId } = req.params;
  const thread = await threadService.updateThread(threadId, req.body);
  res.status(200).json({
    success: true,
    message: "Thread updated successfully",
    data: thread,
  });
});

exports.deleteThread = asyncErrorHandler(async (req, res, next) => {
  const { id: threadId } = req.params;
  await threadService.deleteThread(threadId);
  return res
    .status(200)
    .json({ success: true, message: "Thread deleted successfully" });
});
