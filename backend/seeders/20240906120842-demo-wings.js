'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const societies = await queryInterface.sequelize.query(
      'SELECT id FROM "societies";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (societies.length < 2) {
      throw new Error('Not enough societies found. Ensure you have at least two societies created.');
    }

    const wingAdmins = await queryInterface.sequelize.query(
      `SELECT u.id FROM "users" u
       JOIN "userRoles" ur ON u.id = ur."userId"
       WHERE ur."roleId" = (SELECT id FROM "roles" WHERE name = 'wingAdmin')
       ORDER BY u."createdAt" ASC LIMIT 7;`,
      { type: Sequelize.QueryTypes.SELECT }
    );    

    if (wingAdmins.length < 5) {
      throw new Error('Not enough wing admins found. Ensure you have at least five wing admin users created.');
    }

    const wings = [
      {
        id: uuidv4(),
        name: 'A',
        wingAdminId: wingAdmins[0].id,
        societyId: societies[0].id,
      },
      {
        id: uuidv4(),
        name: 'B',
        wingAdminId: wingAdmins[1].id,
        societyId: societies[0].id,
      },
      {
        id: uuidv4(),
        name: 'C',
        wingAdminId: null,
        societyId: societies[0].id,
      },

      {
        id: uuidv4(),
        name: 'A',
        wingAdminId: wingAdmins[2].id,
        societyId: societies[1].id,
      },
      {
        id: uuidv4(),
        name: 'B',
        wingAdminId: wingAdmins[3].id, 
        societyId: societies[1].id,
      },
      {
        id: uuidv4(),
        name: 'C',
        wingAdminId: null,
        societyId: societies[1].id,
      },
      {
        id: uuidv4(),
        name: 'D',
        wingAdminId: wingAdmins[4].id,
        societyId: societies[1].id,
      },
    ];

    await queryInterface.bulkInsert('wings', wings, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('wings', null, {});
  },
};