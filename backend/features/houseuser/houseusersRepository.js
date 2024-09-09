const { db } = require("../../config/connection");
const { User, Wing, Society, HouseUser, House } = db;

exports.getHouseDetailsById = async (houseId) => {
  try {
    const houseDetails = await HouseUser.findAll({
      where: { HouseId: houseId },
      attributes: ["UserId", "id"],
    });
    console.log(houseId);
    console.log(houseDetails);
    

    return houseDetails;
  } catch (e) {
    throw new Error(e.message);
  }
};
