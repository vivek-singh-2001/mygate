const asyncErrorHandler = require("../../../utils/asyncErrorHandler");
const commentService = require("./postCommentService");

exports.createComment = asyncErrorHandler(async (req, res, next) => {
  const commentData = req.body;
  const attachment = req.file;
  commentData.attachments = attachment?.filename || null
  console.log(commentData);
  

  const comment = await commentService.createComment(commentData);
  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: comment,
  });
});

exports.getCommentById = asyncErrorHandler(async (req, res, next) => {
  const { id: commentId } = req.params;

  const comment = await commentService.getCommentById(commentId);
  res.status(200).json({ success: true, data: comment });
});

exports.getCommentsByPostId = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const comments = await commentService.getCommentsByPostId(postId);
  res.status(200).json({ success: true, data: comments });
});

exports.updateComment = asyncErrorHandler(async (req, res, next) => {
  const { id: commentId } = req.params;

  const comment = await commentService.updateComment(commentId, req.body);
  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: comment,
  });
});

exports.deleteComment = asyncErrorHandler(async (req, res, next) => {
  const { id: commentId } = req.params;

  await commentService.deleteComment(commentId);
  res.status(200).json({ success: true, message: "Comment deleted successfully" });
});
