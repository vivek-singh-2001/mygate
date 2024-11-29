const { db } = require("../../../config/connection");
const { Post, User } = db;

exports.createPost = async (postData) => {
  try {
    const post = await Post.create({
      content: postData.content,
      attachments: postData.attachments || null,
      threadId: postData.threadId,
      userId: postData.userId,
    });
    
    const createdPost = await Post.findOne({
      where: { id: post.id },
      include: {
        model: User,
        attributes: ['id', 'firstname', 'lastname', 'photo'],
      },
    });

    return createdPost;
  } catch (error) {
    console.log(error);
  }
};

exports.getPostById = async (postId) => {
  return await Post.findByPk(postId, {
    include: [
      {
        model: User,
        attributes: ["id", "firstname", "lastname", "photo"],
      },
    ],
  });
};

exports.getPostsByThreadId = async (threadId) => {
  return await Post.findAll({
    where: { threadId },
    include: [
      {
        model: User,
        attributes: ["id", "firstname", "lastname", "photo"],
      },
    ],
  });
};

exports.updatePost = async (postId, postData) => {
  const post = await Post.findByPk(postId);
  return await post.update(postData);
};

exports.deletePost = async (postId) => {
  const post = await Post.findByPk(postId);
  return await post.destroy();
};

exports.incrementRepliedCount = async (postId) => {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new CustomError("Post not found", 404);
    }
  
    post.replyCount += 1; // Increment repliedCount
    await post.save();
  
    return post;
  };
  
