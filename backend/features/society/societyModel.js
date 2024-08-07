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
    },
    {
      timestamps: true,
    }
  );
  return Society;
};

// const newSociety = await Society.create({
//   name: "Sunrise Apartments",
//   address: {
//     street: "123 Main St",
//     city: "Springfield",
//     state: "IL",
//     zip: "62701",
//   },
//   contact: "555-1234",
// });

// const society = await Society.findOne({ where: { name: 'Sunrise Apartments' } });
// console.log(society.address.street);  // Output: 123 Main St
// console.log(society.address.city);    // Output: Springfield
// console.log(society.address.state);   // Output: IL
// console.log(society.address.zip);     // Output: 62701
