const { body } = require("express-validator");

const bodyValidator = (fields) => {
  return fields.map(({ name, isRequired, type }) => {
    let validationChain = body(name).trim();

    if (isRequired) {
      validationChain = validationChain
        .notEmpty()
        .withMessage(`${name} is required.`);
    }

    switch (type) {
      case "string":
        validationChain = validationChain
          .isString()
          .withMessage(`${name} must be a string.`);
        break;
      case "int":
        validationChain = validationChain
          .isInt({ min: 1 })
          .withMessage(`${name} must be a positive integer.`);
        break;
      case "date":
        validationChain = validationChain
          .isISO8601()
          .withMessage(`${name} must be a valid date.`);
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }

    return validationChain;
  });
};
