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
      societyAdminId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: true // Allow null if a society doesn't have an admin
      },
      status:{
        type: DataTypes.ENUM('pending', 'approved','rejected'),
        defaultValue: 'pending'  // Default status is active
      },
      csvData:{
        type: DataTypes.TEXT,
        allowNull: true 
      }
    },
    {
      timestamps: true,
      tableName:'Societies'
    }
  );

  return Society;
};
