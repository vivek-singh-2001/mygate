const express = require('express');
const chatController = require('./chatController');

const router = express.Router();

router.post('/send', chatController.sendMessage);
router.get('/history/:userId1/:userId2', chatController.getChatHistory);

module.exports = router;
