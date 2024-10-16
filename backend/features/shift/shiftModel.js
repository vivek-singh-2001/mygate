module.exports = (connectDB,DataTypes) => {
  const Shift = connectDB.define(
    "Shift",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      staffId: {
        type: DataTypes.UUID, 
        allowNull: false,
        references: {
          model: 'staff', 
          key: 'id', 
        },
      },
      shiftType: {
        type: DataTypes.ENUM('Morning', 'Evening', 'Night'),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
   
      attendanceStatus: {
        type: DataTypes.ENUM('Present', 'Absent'), 
        allowNull: true,
      },
    },
    {
      tableName: "shifts", 
      hooks: {
        beforeCreate: (shift) => {
          
        },
        beforeUpdate: (shift) => {
         
        },
      },
    }
  );

  return Shift;
};
