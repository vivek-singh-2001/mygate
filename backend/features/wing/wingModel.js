module.exports = (connectDB, DataTypes) => {
  const Wing = connectDB.define(
    "Wing",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      wingAdminId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true, // Allow null if a wing doesn't have an admin
      },
    },
    {
      tableName: "wings",
      timestamps: false,
    }
  );

  Wing.associate = function (models) {
    Wing.hasMany(models.House, {
      foreignKey: "wingId",
      as: "houses", // Alias for joining in queries
    });
  };
  return Wing;
};
