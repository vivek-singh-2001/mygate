const chatRepository = require('./chatReposetory');

exports.sendMessage = async (senderId, receiverId, message) => {
  return await chatRepository.createChat(senderId, receiverId, message);
};

exports.getChatHistory = async (userId1, userId2) => {
  return await chatRepository.getChatsBetweenUsers(userId1, userId2);
};
