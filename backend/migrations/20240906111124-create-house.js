"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("houses", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      house_no: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
     
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("houses");
  },
};
