module.exports = (connectDB,DataTypes) => {
  const Staff = connectDB.define(
    "Staff",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'roles', 
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      contactNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      societyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'societies', 
          key: 'id',
        },
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
    },
    {
      tableName: "staff",
      hooks: {
        beforeCreate: (staff) => {
        
        },
        beforeUpdate: (staff) => {
          
        },
      },
    }
  );

  return Staff;
};
