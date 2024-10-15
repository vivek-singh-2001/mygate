const { db } = require("../../config/connection");
const { User, HouseUser, House, Floor, UserRole, Role } = db;

exports.getWingHouseDetailsById = async (wingId) => {
  try {
    const floors = await Floor.findAll({
      where: { wingId },
      attributes: ["id"],
    });

    if (!floors.length) return [];

    const floorIds = floors.map((floor) => floor.id);

    const ownerRole = await Role.findOne({
      where: { name: "owner" },
    });

    if (!ownerRole) throw new Error("Owner role not found");

    const winghouseDetails = await House.findAll({
      where: { floorId: floorIds },
      attributes: [
        "house_no",
        "id",
      ],
      include: [
        {
          model: HouseUser,
          attributes: ["id", "userId", "houseId"],
          include: [
            {
              model: User,
              attributes: ["firstname", "lastname","email", "number", "id"],
              include: [
                {
                  model: UserRole,
                  attributes: [],
                  where: { roleId: ownerRole.id },
                },
              ],
            },
          ],
        },
      ],
    });

    const formattedResults = winghouseDetails.map((house) => {
      const a = house.HouseUsers.find((houseUser) => houseUser.User)
      return {
        id: house.id,
        house_no: house.house_no,
        userCount: house.HouseUsers.length,
        owner: a ? a.User : null,
      }
    });

    return formattedResults;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};
