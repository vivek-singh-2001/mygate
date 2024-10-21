module.exports = (connectDB, DataTypes) => {
  const Notice = connectDB.define(
    "Notification",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      media: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isThought: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false,
      },
      isNotice: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false,
      }
    },
    {
      timestamps: true,
      tableName:'notifications'
    }
  );
  return Notice
};
