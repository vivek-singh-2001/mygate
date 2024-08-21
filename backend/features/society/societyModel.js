module.exports = (connectDB, DataTypes) => {

  const Society = connectDB.define(
    "Society",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,

      },
      address: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return Society;
};


