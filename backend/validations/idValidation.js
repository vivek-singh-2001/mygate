const { param } = require('express-validator');

const idValidationSchema = [
  param('id').isUUID().withMessage('ID must be a valid uuid.'),
];

module.exports = {
  idValidationSchema,
};