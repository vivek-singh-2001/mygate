'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const societyAdmins = await queryInterface.sequelize.query(
      `SELECT u.id FROM "users" u
       JOIN "userRoles" ur ON u.id = ur."userId"
       WHERE ur."roleId" = (SELECT id FROM "roles" WHERE name = 'societyAdmin')
       ORDER BY u."createdAt" ASC LIMIT 2;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (societyAdmins.length < 2) {
      throw new Error('Not enough society admins found. Ensure you have at least two society admin users created.');
    }

    const societies = [
      {
        id: uuidv4(),
        name: 'Green Meadows Society',
        address: JSON.stringify({ city: 'Mumbai', state: 'Maharashtra', country: 'India' }),
        societyAdminId: societyAdmins[0].id,
        status:'pending',
        csvData:null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Blue Hills Society',
        address: JSON.stringify({ city: 'Pune', state: 'Maharashtra', country: 'India' }),
        societyAdminId: societyAdmins[1].id,
        status:'pending',
        csvData:null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('societies', societies, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('societies', null, {});
  },
};