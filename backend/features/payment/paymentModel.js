module.exports = (connectDB, DataTypes) => {
  const Payment = connectDB.define(
    "Payment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      houseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "houses",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Maintenance"
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "failure", "success"),
        defaultValue: "pending",
      },
      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      razorpayPaymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      razorpaySignature: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      failureReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "payments",
    }
  );
  return Payment;
};
