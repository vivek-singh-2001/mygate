"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("floors", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      floor_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      wingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "wings",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("floors");
  },
};
