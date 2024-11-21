const { db } = require("../../config/connection");
const CustomError = require("../../utils/CustomError");
const { Forum } = db;

exports.createForum = async (forumData) => {
  return await Forum.create(forumData);
};

exports.getAllForums = async (societyId) => {
  return await Forum.findAll({
    where:{societyId}
  });
};

exports.getForumById = async (id) => {
  return await Forum.findByPk(id);
};

exports.updateForum = async (id, updates) => {
  const forum = await Forum.findByPk(id);
  if (!forum) {
    return null;
  }

  return await forum.update(updates);
};

exports.deleteForum = async (id) => {
  const forum = await Forum.findByPk(id);
  if (!forum) {
    return null;
  }

  await forum.destroy();
  return true;
};
