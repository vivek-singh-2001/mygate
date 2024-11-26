const commentRepository = require("./postCommentReppository");
const postRepository = require("../threadPost/threadPostRepository"); // Assume this exists
const CustomError = require("../../../utils/CustomError");

exports.createComment = async (commentData) => {
  if (!commentData.postId || !commentData.userId || !commentData.content) {
    throw new CustomError("Invalid comment data", 400);
  }

  // Create the comment
  const comment = await commentRepository.createComment(commentData);
  if (!comment) {
    throw new CustomError("Error creating comment", 400);
  }

  // Increment the repliedCount for the post
  const post = await postRepository.getPostById(commentData.postId);
  if (!post) {
    throw new CustomError("Post not found", 404);
  }

  await postRepository.incrementRepliedCount(commentData.postId); // Increment repliedCount

  return comment;
};

exports.getCommentById = async (commentId) => {
  if (!commentId) {
    throw new CustomError("Comment ID is required", 400);
  }

  const comment = await commentRepository.getCommentById(commentId);
  if (!comment) {
    throw new CustomError("Comment not found", 404);
  }

  return comment;
};

exports.getCommentsByPostId = async (postId) => {
  if (!postId) {
    throw new CustomError("Post ID is required", 400);
  }

  const comments = await commentRepository.getCommentsByPostId(postId);
  return comments;
};

exports.updateComment = async (commentId, commentData) => {
  const comment = await commentRepository.getCommentById(commentId);
  if (!comment) {
    throw new CustomError("Invalid comment ID", 404);
  }

  return await commentRepository.updateComment(commentId, commentData);
};

exports.deleteComment = async (commentId) => {
  const comment = await commentRepository.getCommentById(commentId);
  if (!comment) {
    throw new CustomError("Invalid comment ID", 404);
  }

  return await commentRepository.deleteComment(commentId);
};
