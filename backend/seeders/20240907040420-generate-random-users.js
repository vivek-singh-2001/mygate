'use strict';

const { faker } = require('@faker-js/faker');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

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

const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
      const passcode = generatePasscode();
      const photo = generateRandomPhoto();

      const createdAt = new Date();
      const updatedAt = new Date();

      users.push({
        id: uuidv4(),
        firstname,
        lastname,
        email,
        password,
        number,
        dateofbirth,
        passcode,
        photo,
        createdAt,
        updatedAt,
      });
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
