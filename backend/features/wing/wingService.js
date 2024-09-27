const wingRepository = require("./wingRepository");
const CustomError = require("../../utils/CustomError");


exports.getWingDetils = async (wingId) => {
    const wingDetails = await wingRepository.getWingDetailsById(wingId);
    
    if (!wingDetails) {
      throw new CustomError(`User with ID ${id} not found`, 404);
    }

    return wingDetails;
  };