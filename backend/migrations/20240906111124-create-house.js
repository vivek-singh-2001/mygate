"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("houses", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      house_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      floorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'floors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("houses");
  },
};
