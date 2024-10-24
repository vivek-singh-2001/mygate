const { db } = require("../../config/connection");
const CustomError = require("../../utils/CustomError");
const {  NotificationCount } = db;

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
  const transaction = await db.connectDB.transaction();
  try {
    const notificationCount = await NotificationCount.findOne({
      where: {
        societyId,
        userId,
        type,
      },
      transaction,
    });

    let updatedCount;
    if (notificationCount) {
      notificationCount.count += 1;
      await notificationCount.save({ transaction });
      updatedCount = notificationCount.count;
    } else {
      const newCount = await NotificationCount.create(
        {
          societyId,
          userId,
          type,
          count: 1,
        },
        { transaction }
      );
      updatedCount = newCount.count;
    }

    await transaction.commit();
    return updatedCount;
  } catch (error) {
    await transaction.rollback();
    throw new Error("Error incrementing notification count");
  }
};

exports.incrementCountForUsers = async (societyId, societyUsers, type) => {
  const transaction = await db.connectDB.transaction();

  try {
    const userIds = societyUsers.map(user => user.id);

    // Fetch all existing notification counts for the users in one query
    const existingCounts = await NotificationCount.findAll({
      where: {
        societyId,
        userId: userIds,
        type
      },
      transaction,
    });

    // Prepare updates and new entries
    const updates = [];
    const newEntries = [];

    existingCounts.forEach(notificationCount => {
      notificationCount.count += 1;
      updates.push(notificationCount.save({ transaction })); // Queue save operation
    });

    // Prepare new entries for users that don't have a count yet
    const existingUserIds = existingCounts.map(count => count.userId);
    const usersToCreate = societyUsers.filter(user => !existingUserIds.includes(user.id));

    usersToCreate.forEach(user => {
      newEntries.push(NotificationCount.create(
        {
          societyId,
          userId: user.id,
          type,
          count: 1,
        },
        { transaction }
      )); // Queue create operation
    });

    // Execute all save and create operations in parallel
    await Promise.all([...updates, ...newEntries]);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Error incrementing notification count for users:", error);
    throw new Error("Error incrementing notification count for users");
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
    throw new CustomError(
      "Notification count not found for this user in the specified society",
      404
    );
  }
};
