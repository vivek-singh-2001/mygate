"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const [users, roles] = await Promise.all([
      queryInterface.sequelize.query('SELECT id FROM "users";', {
        type: Sequelize.QueryTypes.SELECT,
      }),
      queryInterface.sequelize.query('SELECT id, name FROM "roles";', {
        type: Sequelize.QueryTypes.SELECT,
      }),
    ]);

    if (!users.length || !roles.length) {
      throw new Error("No users or roles found.");
    }

    const userRoles = [];

    users.forEach((user, index) => {
      let roleId;

      if (index < 2) {
        roleId = roles.find((role) => role.name === "societyAdmin").id;
      } else if (index < 9) {
        roleId = roles.find((role) => role.name === "wingAdmin").id;
      } else if (index < 140) {
        roleId = roles.find((role) => role.name === "owner").id;
      } else {
        roleId = roles.find((role) => role.name === "familyMember").id;
      }

      userRoles.push({ id: uuidv4(), userId: user.id, roleId });
      if (index < 9) {
        const ownerRoleId = roles.find((role) => role.name === "owner").id;
        userRoles.push({ id: uuidv4(), userId: user.id, roleId: ownerRoleId });
      }
    });

    await queryInterface.bulkInsert("userRoles", userRoles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("userRoles", null, {});
  },
};
