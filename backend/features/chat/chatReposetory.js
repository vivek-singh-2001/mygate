const Chat = require('./chatModel');

exports.createChat = async (senderId, receiverId, message) => {
  return await Chat.create({ senderId, receiverId, message });
};

exports.getChatsBetweenUsers = async (userId1, userId2) => {
  return await Chat.findAll({
    where: {
      [Op.or]: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    },
    order: [['createdAt', 'ASC']],
  });
};
