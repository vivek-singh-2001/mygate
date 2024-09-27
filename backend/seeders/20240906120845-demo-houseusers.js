"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const houseUsers = [];
    const totalUsers = 500;
    const totalHouses = 40;
    const maxUsersPerHouse = 6;

    // Create a map to track how many users have been assigned to each house
    const houseUserCount = {};

    // Loop through each user and assign them to a house if available
    for (let UserId = 1; UserId <= totalUsers; UserId++) {
      // Find a random houseId to allot the user
      let HouseId;
      let foundHouse = false;

      while (!foundHouse) {
        // Find a random houseId between 1 and totalHouses
        HouseId = Math.floor(Math.random() * totalHouses) + 1;
        
        // Check if the house already has 6 users
        if (
          !houseUserCount[HouseId] ||
          houseUserCount[HouseId] < maxUsersPerHouse
        ) {
          houseUserCount[HouseId] = houseUserCount[HouseId]
            ? houseUserCount[HouseId] + 1
            : 1;
          foundHouse = true;
        }
      }

      // Add the house-user relationship
      houseUsers.push({
        UserId,
        HouseId,
      });

      // Stop if all users are allotted
      if (
        Object.keys(houseUserCount).length >= totalHouses &&
        houseUserCount[HouseId] >= maxUsersPerHouse
      ) {
        break;
      }
    }

    await queryInterface.bulkInsert("houseUsers", houseUsers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("houseUsers", null, {});
  },
};
