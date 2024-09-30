module.exports = (connectDB, DataTypes) => {
  const Blog = connectDB.define(
    "Blog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      media: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "blogs",
    }
  );
  return Blog;
};
