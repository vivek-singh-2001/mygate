module.exports = (connectDB, DataTypes) => {
    const Wing = connectDB.define(
        'Wing',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            wingAdminId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                allowNull: true // Allow null if a wing doesn't have an admin
            }
        },{
           tableName: 'wings',
           timestamps: false,
        }
    );

    Wing.associate = function(models) {
        Wing.hasMany(models.House, {
          foreignKey: "WingId",
          as: "Houses",  // Alias for joining in queries
        });
      };
    return Wing;
};
