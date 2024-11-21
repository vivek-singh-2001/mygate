module.exports = (connectDB, DataTypes) => {
  const Thread = connectDB.define(
    "Thread",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      media: {
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

  // Associations
  //   // A thread can have many posts
  //   Thread.hasMany(models.Post, {
  //     foreignKey: 'threadId',
  //     as: 'posts',
  //   });
  // };

  return Thread;
};
