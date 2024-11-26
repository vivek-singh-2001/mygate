const { db } = require("../../../config/connection");
const { Comment, User, Post } = db;

exports.createComment = async (commentData) => {

  return await Comment.create({
    content: commentData.content,
    attachments: commentData.attachments,
    postId: commentData.postId,
    userId: commentData.userId,
  });
};

exports.getCommentById = async (commentId) => {
  return await Comment.findByPk(commentId, {
    include: [
      {
        model: User,
        attributes: ["id", "firstname", "lastname", "photo"],
      },
      {
        model: Post,
        attributes: ["id", "content", "attachments"],
      },
    ],
  });
};

exports.getCommentsByPostId = async (postId) => {
  return await Comment.findAll({
    where: { postId },
    include: [
      {
        model: User,
        attributes: ["id", "firstname", "lastname", "photo"],
      },
    ],
  });
};

exports.updateComment = async (commentId, commentData) => {
  const comment = await Comment.findByPk(commentId);
  return await comment.update(commentData);
};

exports.deleteComment = async (commentId) => {
  const comment = await Comment.findByPk(commentId);
  return await comment.destroy();
};
