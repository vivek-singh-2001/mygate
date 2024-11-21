const forumRepository = require('./forumRepository');

exports.createForum = async (forumData) => {
  return await forumRepository.createForum(forumData);
};

exports.getAllForums = async (societyId) => {
  return await forumRepository.getAllForums(societyId);
};

exports.getForumById = async (id) => {
  return await forumRepository.getForumById(id);
};

exports.updateForum = async (id, updates) => {
  return await forumRepository.updateForum(id, updates);
};

exports.deleteForum = async (id) => {
  return await forumRepository.deleteForum(id);
};
