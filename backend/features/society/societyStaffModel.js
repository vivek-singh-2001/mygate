module.exports = (connectDB, DataTypes) => {
    const SocietyStaff = connectDB.define(
      "SocietyStaff",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        societyId: {
          type: DataTypes.UUID,
          references: {
            model: 'societies',
            key: 'id'
          },
          allowNull: true
        },
        staffId: {
            type: DataTypes.UUID,
            references: {
              model: 'users',
              key: 'id'
            },
            allowNull: true
          },
       
      },
      {
        timestamps: true,
        tableName:'societystaffs'
      }
    );
  
    return SocietyStaff;
  };
  