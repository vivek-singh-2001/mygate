const houseRepository = require("./houseRepository");
const CustomError = require("../../utils/CustomError");

exports.getWingHouseDetails = async (wingId) => {
  const wingHouseDetails = await houseRepository.getWingHouseDetailsById(
    wingId
  );

  if (!wingHouseDetails) {
    throw new CustomError(`wing with ID ${id} not found`, 404);
  }

  return wingHouseDetails;
};
