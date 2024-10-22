module.exports = (connectDB, DataTypes) => {
  const NotificationCount = connectDB.define(
    "NotificationCount",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      societyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "societies",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      type: {
        type: DataTypes.ENUM("notice", "chat", "complaint"),
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: "notificationCounts",
    }
  );
  return NotificationCount;
};
