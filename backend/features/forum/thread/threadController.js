const asyncErrorHandler = require("../../../utils/asyncErrorHandler");
const threadService = require("./threadService");

exports.createThread = asyncErrorHandler(async (req, res, next) => {
  const thread = await threadService.createThread(req.body);
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
  const { id: forumId } = req.params;
  const threads = await threadService.getAllThreads(forumId);
  res.status(200).json({ data: threads });
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
