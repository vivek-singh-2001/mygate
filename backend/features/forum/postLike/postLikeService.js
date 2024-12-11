const CustomError = require("../../../utils/CustomError");
const { getPostById } = require("../threadPost/threadPostRepository");
const { getPostLike, likePost } = require("./postLikeRepository");

exports.likePost = async (postId, userId) => {
  try {
    const existingLike = await getPostLike(postId, userId);
    const post = await getPostById(postId);

    if (existingLike) {
      await existingLike.destroy();
      await post.decrement("likes");
      return false;
    }

    const postLike = await likePost(postId, userId);
    if (!postLike) {
      throw new CustomError("Error liking post", 400);
    }
    await post.increment("likes");
    return true;
  } catch (error) {
    console.log(error);
  }
};
