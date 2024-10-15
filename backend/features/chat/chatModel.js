const User = require('../users/userModel');

module.exports = (connectDB, DataTypes) => {
  const Chat = connectDB.define(
    "Chat",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: 'chats',
    }
  );

  // Define any instance methods if needed
  Chat.prototype.getChatDetails = function() {
    return {
      id: this.id,
      senderId: this.senderId,
      receiverId: this.receiverId,
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  return Chat;
};
