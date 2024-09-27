const { param } = require('express-validator');

const idValidationSchema = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer.'),
];

module.exports = {
  idValidationSchema,
};