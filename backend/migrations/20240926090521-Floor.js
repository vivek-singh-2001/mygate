'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Floors', {
      floor_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      wing_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Wings', // Name of the table you have for Wing
          key: 'wing_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      floor_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      number_of_houses: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Floors');
  }
};
