'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otpExpiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      passcode: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: 1111111,
      },
      dateofbirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      isOwner: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isMember: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      passwordChangedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      passwordResetToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passwordResetTokenExpires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      photo:{
        type: Sequelize.STRING,
        allowNull: true,
      
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
