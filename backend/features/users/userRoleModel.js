module.exports = (connectDB, DataTypes) => {
  const UserRole = connectDB.define(
    "UserRole",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Role",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
      tableName: "userRoles",
    }
  );

  return UserRole
};
