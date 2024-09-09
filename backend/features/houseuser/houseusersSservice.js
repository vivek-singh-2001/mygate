const houseuserRepository = require("./houseusersRepository");
const CustomError = require("../../utils/CustomError");


exports.getHouseDetails = async (houseId) => {
    const HouseDetails = await houseuserRepository.getHouseDetailsById(houseId);
    
    if (!HouseDetails) {
      throw new CustomError(`house with ID ${id} not found`, 404);
    }

    return HouseDetails;
  };