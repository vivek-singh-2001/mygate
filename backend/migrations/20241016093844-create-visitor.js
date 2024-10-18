'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('visitors', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      houseId: {
        type: Sequelize.UUID,
        references: {
          model: "houses",
          key: "id",
        },
        allowNull: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      number: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      vehicleNumber: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      purpose: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'Visit'
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      visitTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      passcode: {
        type: Sequelize.STRING(6),
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('Invited', 'Uninvited'),
        allowNull: false
      },
      responsibleUser: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        onUpdate: Sequelize.fn('NOW')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('visitors');
  }
};
