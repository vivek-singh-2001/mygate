module.exports = (connectDB, DataTypes) => {
  const House = connectDB.define(
    "House",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      house_no: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return House;
};
