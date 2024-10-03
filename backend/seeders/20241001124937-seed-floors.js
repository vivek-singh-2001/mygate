'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const wings = await queryInterface.sequelize.query(
      'SELECT id FROM "wings";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!wings.length) {
      throw new Error('No wings found. Ensure you have wings created before seeding floors.');
    }

    const floors = [];

    wings.forEach((wing) => {
      for (let i = 1; i <= 5; i++) {
        floors.push({
          id: uuidv4(),
          floor_number: i,
          wingId: wing.id,
        });
      }
    });

    await queryInterface.bulkInsert('floors', floors, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('floors', null, {});
  },
};
