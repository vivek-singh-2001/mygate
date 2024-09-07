'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('Societies', 
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false,
        },
        address: {
          type: Sequelize.JSON,
          allowNull: false,
        },
        societyAdminId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          allowNull: true // Allow null if a society doesn't have an admin
        }
      }
    );
     
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.dropTable('Societies');
     
  }
};
