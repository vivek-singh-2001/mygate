const { db } = require("../../../config/connection");
const { Like, User } = db;

exports.getPostLike = async (postId, userId) => {
  console.log(postId, userId);

  return await Like.findOne({
    where: { postId, userId },
  });
};

exports.likePost = async (postId, userId) => {
  try {
    return await Like.create({ postId, userId });
  } catch (error) {
    console.log(error.message);
  }
};
