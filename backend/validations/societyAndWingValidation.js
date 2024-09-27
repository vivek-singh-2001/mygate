const { param } = require('express-validator');

const societyAndWingValidationSchema = [
  param('societyId')
    .isInt({ min: 1 })
    .withMessage('Society ID must be a positive integer.'),

  param('wingId')
    .isInt({ min: 1 })
    .withMessage('Wing ID must be a positive integer.'),
];

module.exports = {
  societyAndWingValidationSchema,
};