'use strict';

const { faker } = require('@faker-js/faker');
const crypto = require('crypto');

const encryptPassword = async (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const generateIndianPhoneNumber = () => {
  const startDigit = faker.helpers.arrayElement(['6', '7', '8', '9']);
  let remainingDigits = '';
  for (let i = 0; i < 9; i++) {
    remainingDigits += Math.floor(Math.random() * 10);
  }
  return startDigit + remainingDigits;
};

const generateRandomPhoto = () => {
  return `https://picsum.photos/seed/${faker.string.uuid()}/200`;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];

    for (let i = 0; i < 500; i++) {
      const firstname = faker.person.firstName();
      const lastname = faker.person.lastName();
      const email = faker.internet.email(firstname, lastname);
      const password = await encryptPassword('password123');
      const number = generateIndianPhoneNumber();
      const dateofbirth = faker.date.past(30, '2000-01-01');
      const photo = generateRandomPhoto();

      users.push({
        firstname,
        lastname,
        email,
        password,
        number,
        dateofbirth,
        isOwner: false,
        isMember: true,
        photo, // Include the random photo here
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
