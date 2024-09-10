'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('wings', [
      {
        id: 1,
        name: 'A Wing',
        wingAdminId: 1
      },
      {
        id: 2,
        name: 'B Wing',
        wingAdminId: 2
      },
      {
        id: 3,
        name: 'C Wing',
        wingAdminId: 3
      } ,
      {
        id: 4,
        name: 'D Wing',
        wingAdminId: 4
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('wings', null, {});
  }
};
