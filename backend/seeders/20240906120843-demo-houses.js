'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const floors = await queryInterface.sequelize.query(
      'SELECT id, floor_number FROM "floors";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!floors.length) {
      throw new Error('No floors found. Ensure you have floors created before seeding houses.');
    }

    const houses = [];

    floors.forEach((floor) => {
      const baseHouseNumber = floor.floor_number * 100;

      for (let i = 1; i <= 4; i++) {
        houses.push({
          id: uuidv4(),
          house_no: baseHouseNumber + i,
          floorId: floor.id
        });
      }
    });

    await queryInterface.bulkInsert('houses', houses, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('houses', null, {});
  },
};
