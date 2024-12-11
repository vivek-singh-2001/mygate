const asyncErrorHandler = require("../../../utils/asyncErrorHandler");
const { likePost } = require("./postLikeService");

exports.likePost = asyncErrorHandler(async (req, res, next) => {
  const { postId, userId } = req.body;

  const isLiked = await likePost(postId, userId);

  res
    .status(200)
    .json({
      success: true,
      message: `${
        isLiked ? "Post liked successfully." : "Like removed successfully."
      }`,
      isLiked,
    });
});
