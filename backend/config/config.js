require('dotenv').config({ path: "./config.env" });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    // host: 'db',
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    // host: 'db',
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    // host: 'db',
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  }
};
