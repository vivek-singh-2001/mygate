module.exports = (connectDB, DataTypes) => {
  const Visitor = connectDB.define(
    "Visitor",
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
      },
      number: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      vehicleNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      purpose: {
        type: DataTypes.STRING(50),
        default: 'Visit',
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      visitTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      passcode: {
        type: DataTypes.STRING(6),
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM('Invited', 'Uninvited'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        default: 'Pending',
        allowNull: false
      }
    },
    {
      tableName: "visitors",
      timestamps: true
    }
  );

  return Visitor;
};
