"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      wingAdminId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
        onUpdate: 'CASCADE',
      },
    }, {
      timestamps: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("wings");
  },
};