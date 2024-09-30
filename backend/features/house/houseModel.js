module.exports = (connectDB, DataTypes) => {
  const House = connectDB.define(
    "House",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      house_no: {
        type: DataTypes.STRING(10),
        allowNull: false,
      }
    },
    {
      timestamps: true,
      tableName:'houses'
    }
  );
  return House;
};
