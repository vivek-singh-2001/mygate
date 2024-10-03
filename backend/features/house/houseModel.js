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
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      timestamps: false,
      tableName:'houses'
    }
  );
  return House;
};
