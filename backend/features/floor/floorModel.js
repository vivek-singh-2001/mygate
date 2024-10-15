module.exports = (connectDB, DataTypes) => {
  const Floor = connectDB.define(
    "Floor",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      floor_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "floors",
    }
  );

  return Floor;
};
