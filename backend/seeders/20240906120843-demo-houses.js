'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const houses = [];
    
    // Loop to create houses from 101-110, 201-210, 301-310, 401-410
    for (let floor = 1; floor <= 4; floor++) {
      for (let houseNumber = 1; houseNumber <= 10; houseNumber++) {
        const house_no = `${floor}${houseNumber}`; 
        houses.push({
          house_no,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('houses', houses, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('houses', null, {});
  }
};
