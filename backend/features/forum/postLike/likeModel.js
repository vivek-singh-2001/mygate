module.exports = (connectDB, DataTypes) => {
    const Like = connectDB.define(
      "Like",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        tableName: "likes",
      }
    );
  
    return Like;
  };
  