module.exports = (connectDB, DataTypes) => {
  const ChatRoom = connectDB.define("ChatRoom", {
    societyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return ChatRoom;
};
