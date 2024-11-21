const threadRepository = require("./threadRepository");
const CustomError = require("../../../utils/CustomError");
const { getForumById } = require("../forumRepository");
const { getUserById } = require("../../users/userRepository");

exports.createThread = async (threadData) => {
  const forum = await getForumById(threadData.forumId);
  if (!forum) {
    throw new CustomError("Invalid forum id", 400);
  }
  const user = await getUserById(threadData.userId);
  if (!user) {
    throw new CustomError("Invalid user id", 400);
  }

  const thread = await threadRepository.createThread(threadData);
  if (!thread) {
    throw new CustomError("Error creating thread.", 400);
  }
  return thread;
};

exports.getThreadById = async (threadId) => {
  if (!threadId) {
    throw new CustomError("Thread id is required.", 400);
  }
  const thread = await threadRepository.getThreadById(threadId);
  if (!thread) {
    throw new CustomError("Invalid thread id.", 400);
  }
  return thread;
};

exports.getAllThreads = async (forumId) => {
  const forum = await getForumById(forumId);
  if (!forum) {
    throw new CustomError("Invalid forum id.", 400);
  }
  const threads = await threadRepository.getAllThreads(forumId);
  if (!threads || threads.length === 0) {
    throw new CustomError("No threads found.", 404);
  }
  return threads;
};

exports.updateThread = async (threadId, threadData) => {
  const thread = await threadRepository.getThreadById(threadId);
  if (!thread) {
    throw new CustomError("Invalid thread id", 400);
  }

  const updatedThread = await threadRepository.updateThread(
    threadId,
    threadData
  );

  if (!updatedThread) {
    throw new CustomError("Error while updating thread", 400);
  }

  return updatedThread;
};

exports.deleteThread = async (threadId) => {
  const thread = await threadRepository.getThreadById(threadId);
  if (!thread) {
    throw new CustomError("Invalid thread id", 400);
  }

  return await threadService.deleteThread(threadId);
};
