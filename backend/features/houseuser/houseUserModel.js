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
      houseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "House",
          key: "id",
        },
      },
      userId:{
        type:DataTypes.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      }
    },
    {
      timestamps: false,
      tableName: "houseUsers",
    }
  );
  return HouseUser;
};
