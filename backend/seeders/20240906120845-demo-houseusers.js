'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all houses
    const houses = await queryInterface.sequelize.query(
      'SELECT id FROM "houses";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "users" ORDER BY "createdAt" ASC;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (houses.length < 140 || users.length < 500) {
      throw new Error('Not enough houses or users found. Ensure you have at least 140 houses and 500 users.');
    }

    const houseUsers = [];

    houses.forEach((house, index) => {
      const owner = users[index];
      houseUsers.push({
        id: uuidv4(),
        houseId: house.id,
        userId: owner.id,
      });
    });

    // Assign the remaining 360 users as family members to the houses
    let houseIndex = 0;
    for (let i = 140; i < users.length; i++) {
      houseUsers.push({
        id: uuidv4(),
        houseId: houses[houseIndex].id, // Assign family members to houses in a round-robin manner
        userId: users[i].id,
      });

      // Move to the next house after each assignment (round-robin)
      houseIndex = (houseIndex + 1) % houses.length;
    }

    // Insert the houseUsers into the database
    await queryInterface.bulkInsert('houseUsers', houseUsers, {});
  },

  async down(queryInterface, Sequelize) {
    // Delete all entries from the houseUsers table
    await queryInterface.bulkDelete('houseUsers', null, {});
  },
};