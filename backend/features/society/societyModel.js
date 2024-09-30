module.exports = (connectDB, DataTypes) => {
  const Society = connectDB.define(
    "Society",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      societyAdminId: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
      }
    },
    {
      timestamps: true,
      tableName:'societies'
    }
  );

  return Society;
};
