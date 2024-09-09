const { db } = require("../../config/connection");
const { User, Wing, Society, HouseUser, House } = db;

exports.getWingHouseDetailsById = async (wingId) => {
  try {
    const winghouseDetails = await House.findAll({
      where: { WingId: wingId },
      attributes: ["house_no", "id"],
    });

    return winghouseDetails;
  } catch (e) {
    throw new Error(e.message);
  }
};
