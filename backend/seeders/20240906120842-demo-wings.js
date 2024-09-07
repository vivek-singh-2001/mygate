'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('wings', [
      {
        id: 1,
        name: 'A Wing',
        wingAdminId: 1001,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'B Wing',
        wingAdminId: 1002,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'C Wing',
        wingAdminId: 1003,
        createdAt: new Date(),
        updatedAt: new Date()
      } ,
      {
        id: 4,
        name: 'D Wing',
        wingAdminId: 1004,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('wings', null, {});
  }
};
