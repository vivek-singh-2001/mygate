const postRepository = require("./threadPostRepository");
const CustomError = require("../../../utils/CustomError");

exports.createPost = async (postData) => {
  if (!postData.threadId || !postData.userId || !postData.content) {
    throw new CustomError("Invalid post data", 400);
  }

  const post = await postRepository.createPost(postData);

  if (!post) {
    throw new CustomError("Error creating post", 400);
  }

  return post;
};

exports.getPostById = async (postId) => {
  if (!postId) {
    throw new CustomError("Post ID is required", 400);
  }

  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new CustomError("Post not found", 404);
  }

  return post;
};

exports.getPostsByThreadId = async (threadId) => {
  if (!threadId) {
    throw new CustomError("no thread found", 400);
  }

  const posts = await postRepository.getPostsByThreadId(threadId);
  return posts;
};

exports.updatePost = async (postId, postData) => {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new CustomError("Invalid post ID", 404);
  }

  return await postRepository.updatePost(postId, postData);
};

exports.deletePost = async (postId) => {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw new CustomError("Invalid post ID", 404);
  }

  return await postRepository.deletePost(postId);
};
