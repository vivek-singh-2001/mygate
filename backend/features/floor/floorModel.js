
module.exports = (connectDB, DataTypes) => {
  const Floor = connectDB.define('Floor', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    floor_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});


  return Floor;
};
