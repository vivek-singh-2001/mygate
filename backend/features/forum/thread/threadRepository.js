const { db } = require("../../../config/connection");
const { Thread } = db;

exports.createThread = async (threadData) => {
  return await Thread.create({
    title: threadData.title,
    content: threadData.content,
    createdBy: threadData.userId,
    forumId: threadData.forumId,
    status: "open",
    replyCount: 0,
    isPinned: false,
  });
};

exports.getThreadById = async (threadId) => {
  return await Thread.findByPk(threadId);
};

exports.getAllThreads = async (forumId) => {
  return await Thread.findAll({ where: { forumId } });
};

exports.updateThread = async (threadId, threadData) => {
  const thread = await Thread.findByPk(threadId);
  return await thread.update(threadData);
};

exports.deleteThread = async (threadId) => {
  const thread = await Thread.findByPk(id);
  return await thread.destroy();
};
