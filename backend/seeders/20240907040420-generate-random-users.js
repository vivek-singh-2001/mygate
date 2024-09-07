'use strict';

const { faker } = require('@faker-js/faker');
const crypto = require('crypto');

// Encrypt password using the provided function
const encryptPassword = async (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Generate a valid Indian phone number
const generateIndianPhoneNumber = () => {
  const startDigit = faker.helpers.arrayElement(['6', '7', '8', '9']); // Start with a valid digit
  let remainingDigits = '';
  for (let i = 0; i < 9; i++) {
    remainingDigits += Math.floor(Math.random() * 10); // Generate random digits between 0-9
  }
  return startDigit + remainingDigits;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];

    for (let i = 0; i < 500; i++) {
      // Generate random user data
      const firstname = faker.person.firstName();
      const lastname = faker.person.lastName();
      const email = faker.internet.email(firstname, lastname);
      const password = await encryptPassword('password123'); // Use your custom encryption function
      const number = generateIndianPhoneNumber(); // Generate 10-digit Indian number
      const dateofbirth = faker.date.past(30, '2000-01-01'); // Date of birth in the last 30 years

      // Set isOwner to false and isMember to true by default
      const isOwner = false;
      const isMember = true;

      users.push({
        firstname,
        lastname,
        email,
        password,
        number,
        dateofbirth,
        isOwner,
        isMember,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Insert users into the database
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    // Delete the inserted users
    await queryInterface.bulkDelete('Users', null, {});
  }
};
