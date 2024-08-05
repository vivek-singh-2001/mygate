const { db } = require('../config/connection');
const CustomError = require('./CustomError');

const checkRecordExists = async (modelName, id) => {
  if (!db[modelName]) {
    throw new CustomError(`Model ${modelName} does not exist`, 400);
  }

  const model = db[modelName];
  console.log(model);
  const record = await model.findByPk(id);

  return record !== null;
};

module.exports = checkRecordExists;
