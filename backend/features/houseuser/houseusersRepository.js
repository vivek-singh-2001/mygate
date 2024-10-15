const { Model } = require("sequelize");
const { db } = require("../../config/connection");
const { User, Wing, Society, HouseUser, House } = db;

exports.getHouseDetailsById = async (houseId) => {
  try {
    const houseDetails = await HouseUser.findAll({
      where: { houseId },
      attributes: ["userId", "id"],
      include: [
        {
          model: User,
          attributes: ["id", "firstname", "lastname", "number", "email"],
        },
      ],
    });
    return houseDetails;
  } catch (e) {
    throw new Error(e.message);
  }
};
