module.exports = (connectDB, DataTypes) => {
  const Thread = connectDB.define(
    "Thread",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      attachments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open',
        allowNull: false
      },
      replyCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      isPinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      tableName: "threads",
    }
  );

  return Thread;
};
