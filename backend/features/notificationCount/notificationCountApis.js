const express = require('express');
const router = express.Router();
const NotificationCountController = require('./notificationCountController');

router.get('/:societyId/:userId/:type', NotificationCountController.getCount);
router.post('/increment', NotificationCountController.incrementCount);
router.post('/reset/:societyId/:userId/:type', NotificationCountController.resetCount);

module.exports = router;
