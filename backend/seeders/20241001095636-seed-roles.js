'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      { id: uuidv4(), name: "societyAdmin", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "wingAdmin", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "owner", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "security", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "familyMember", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "systemAdmin", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "pending", createdAt: new Date(), updatedAt: new Date() },
    ];

    // Insert the roles into the 'roles' table
    await queryInterface.bulkInsert('roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    // Delete all roles from the 'roles' table
    await queryInterface.bulkDelete('roles', null, {});
  },
};