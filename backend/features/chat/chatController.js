const chatService = require('./chatService');
const asyncErrorHandler = require('../../utils/asyncErrorHandler');

exports.sendMessage = asyncErrorHandler(async (req, res, next) => {
  const { senderId, receiverId, message } = req.body;
  const chat = await chatService.sendMessage(senderId, receiverId, message);
  res.status(201).json({ status: 'success', chat });
});

exports.getChatHistory = asyncErrorHandler(async (req, res, next) => {
  const { userId1, userId2 } = req.params;
  const [chats] = await chatService.getChatHistory(userId1, userId2);
  res.status(200).json({ status: 'success', chats });
});
