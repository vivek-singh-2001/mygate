module.exports = (connectDB, DataTypes) => {
  const ChatMessage = connectDB.define("ChatMessage", {
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ChatRooms",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  return ChatMessage;
};
