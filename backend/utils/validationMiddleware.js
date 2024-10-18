const { validationResult } = require('express-validator');

const validate = (schemas) => {
  return async (req, res, next) => {
    await Promise.all(schemas.map((schema) => schema.run(req)));

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      let genericError;
      const detailedErrors = [];

      errors.array().forEach(error => {
        if (error.location === 'params') {
          genericError = "Parameter validation failed. Please check your input.";
        } else if (error.location === 'body') {
          genericError = "Body validation failed. Please check your input.";
        }
        
        detailedErrors.push({
          field: error.param,
          message: error.msg,
        });
      });

      genericError = genericError || "Validation failed. Please check your input.";

      return res.status(400).json({
        error: genericError,
        details: detailedErrors,
      });
    }
    
    next();
  };
};

module.exports = validate;