const { db } = require("../../config/connection");
const CustomError = require("../../utils/CustomError");
const { User, Wing, Society, HouseUser, House,NotificationCount } = db;


exports.getCount = async (societyId, userId, type) => {
  const notificationCount = await NotificationCount.findOne({
    where: {
      societyId,
      userId,
      type,
    },
  });
  return notificationCount ? notificationCount.count : 0; 
};


exports.incrementCount = async (societyId, userId, type) => {
  const notificationCount = await NotificationCount.findOne({
    where: {
      societyId,
      userId,
      type,
    },
  });

  if (notificationCount) {
    notificationCount.count += 1;
    await notificationCount.save();
    return notificationCount.count; 
  } else {

    const newCount = await NotificationCount.create({
      societyId,
      userId,
      type,
      count: 1,
    });
    return newCount.count; 
  }
};


exports.resetCount = async (societyId, userId, type) => {
  const notificationCount = await db.NotificationCount.findOne({
    where: {
      societyId,
      userId,
      type,
    },
  });

  if (notificationCount) {
    notificationCount.count = 0; 
    await notificationCount.save();
  } else {
    throw new CustomError('Notification count not found for this user in the specified society', 404);
  }
};

