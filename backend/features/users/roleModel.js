module.exports = (connectDB, DataTypes) => {
  const Role = connectDB.define(
    "Role",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
      tableName: "roles",
    }
  );

  return Role;
};
