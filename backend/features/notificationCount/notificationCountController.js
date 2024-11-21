const asyncErrorHandler = require('../../utils/asyncErrorHandler');
const notificationCountService = require('./notificationCountService');
const CustomError = require("../../utils/CustomError")

exports.getCount = asyncErrorHandler( async (req, res,next) => {
  const { societyId, userId, type } = req.params;
  const count = await notificationCountService.getCount(societyId, userId, type);
  res.json({ count });
});

exports.incrementCount = asyncErrorHandler( async (req, res,next) => {
  const { societyId, userId, type } = req.body;
  const count = await notificationCountService.incrementCount(societyId, userId, type);
  res.json({ count });
});

exports.resetCount = asyncErrorHandler( async (req, res,next) => {
  const { societyId, userId, type } = req.params;
  const {senderId} = req.body
const notificationCount =   await notificationCountService.resetCount(societyId, userId, type,senderId);
  res.status(204).send(notificationCount);
});
