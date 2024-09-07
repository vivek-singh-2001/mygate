module.exports = (connectDB, DataTypes) => {
  const Notice = connectDB.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      isThought: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isNotice: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      }
    },
    {
      timestamps: true,
      tableName:'notifications'
    }
  );
  return Notice
};
