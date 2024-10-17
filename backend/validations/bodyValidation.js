const { body } = require("express-validator");

exports.bodyValidator = (fields) => {
  return fields.map(({ name, isRequired, type, enumValues }) => {
    let validationChain = body(name).trim();

    if (isRequired) {
      validationChain = validationChain
        .notEmpty()
        .withMessage(`${name} is required.`);
    } else {
      validationChain = validationChain.optional();
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
      case "uuid":
        validationChain = validationChain
          .isUUID()
          .withMessage(`${name} must be a valid UUID.`);
        break;
      case "enum":
        if (enumValues) {
          validationChain = validationChain
            .isIn(enumValues)
            .withMessage(
              `${name} must be one of the following values: ${enumValues.join(
                ", "
              )}.`
            );
        }
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }

    return validationChain;
  });
};
