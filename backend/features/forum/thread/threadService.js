const threadRepository = require("./threadRepository");
const forumRepository = require("../forumRepository");
const CustomError = require("../../../utils/CustomError");
const { getUserById } = require("../../users/userRepository");

exports.createThread = async (threadData, attachments) => {
  console.log(threadData.forumType, threadData.societyId);

  const forum = await forumRepository.getForumByName(
    threadData.forumType,
    threadData.societyId
  );
  console.log(forum.id);
  if (!forum) {
    throw new CustomError("forum not found", 400);
  }
  const user = await getUserById(threadData.userId);
  if (!user) {
    throw new CustomError("user not found", 400);
  }

  const thread = await threadRepository.createThread(
    threadData,
    attachments,
    forum
  );
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

exports.getAllThreads = async (forumName, societyId) => {
  const forum = await forumRepository.getForumByName(forumName, societyId);
  if (!forum) {
    throw new CustomError("Invalid forum.", 400);
  }
  const threads = await threadRepository.getAllThreads(forum);
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
