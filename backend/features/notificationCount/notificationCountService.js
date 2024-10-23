const notificationCountRepository = require('./notificationCountRepository');
exports.getCount = async (societyId, userId, type) => {
  return await notificationCountRepository.getCount(societyId, userId, type);
};

exports.incrementCount = async (societyId, userId, type) => {
  return await notificationCountRepository.incrementCount(societyId, userId, type);
};

exports.resetCount = async (societyId, userId, type) => {
  return await notificationCountRepository.resetCount(societyId, userId, type);
};


