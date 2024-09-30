module.exports = (connectDB, DataTypes) => {
  const HouseUser = connectDB.define(
    "HouseUser",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "houseUsers",
    }
  );
  return HouseUser;
};
