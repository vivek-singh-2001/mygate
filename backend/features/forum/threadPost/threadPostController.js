const asyncErrorHandler = require("../../../utils/asyncErrorHandler");
const postService = require("./threadPostService");

exports.createPost = asyncErrorHandler(async (req, res, next) => {
  const postData = req.body;
  const attachment = req.file;
  postData.attachments = attachment.filename;

  const post = await postService.createPost(postData);
  res.status(201).json({
    success: true,
    data: post,
  });
});

exports.getPostById = asyncErrorHandler(async (req, res, next) => {
  const { id: postId } = req.params;

  const post = await postService.getPostById(postId);
  res.status(200).json({ success: true, data: post });
});

exports.getPostsByThreadId = asyncErrorHandler(async (req, res, next) => {
  const { threadId } = req.params;
  console.log(threadId);
  

  const posts = await postService.getPostsByThreadId(threadId);
  res.status(200).json({ success: true, data: posts });
});

exports.updatePost = asyncErrorHandler(async (req, res, next) => {
  const { id: postId } = req.params;

  const post = await postService.updatePost(postId, req.body);
  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: post,
  });
});

exports.deletePost = asyncErrorHandler(async (req, res, next) => {
  const { id: postId } = req.params;

  await postService.deletePost(postId);
  res.status(200).json({ success: true, message: "Post deleted successfully" });
});
