'use strict';

/** @type {import('sequelize-cli').Migration} */


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Societies', [
      {
        id: 1,
        name: 'Green Park Society',
        address: JSON.stringify({ street: '123 Green St', city: 'Green City', zip: '12345' }),
        societyAdminId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Societies', null, {});
  }
};
