module.exports = (connectDB, DataTypes) => {
  const Post = connectDB.define(
    "Post",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      replyCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
    },
    {
      timestamps: true,
      tableName: "posts",
    }
  );

  return Post;
};
