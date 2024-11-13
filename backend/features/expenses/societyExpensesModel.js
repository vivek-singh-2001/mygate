module.exports = (connectDB, DataTypes) => {
    const SocietyExpense = connectDB.define(
      "SocietyExpense",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        societyId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "societies", 
            key: "id",
          },
          onDelete: "CASCADE",
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue:Date.now()
        },
        amount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("pending", "approved", "rejected"),
          allowNull: false,
          defaultValue: "pending",
        },
      },
      {
        timestamps: true,
        tableName: "societyExpenses", 
      }
    );
  
    return SocietyExpense;
  };
  