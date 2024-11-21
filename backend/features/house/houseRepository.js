const { db } = require("../../config/connection");
const { User, HouseUser, House, Floor, UserRole, Role ,Wing} = db;

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

exports.findById = async (houseId) => {
  return await House.findOne({
    where: { id: houseId },
  });
};

exports.getHousesBySocietyId = async (societyId) => {
  try {
    return await House.findAll({
      attributes: ['id'],
      include: [
        {
          model: Floor,
          attributes: [],
          required: true,
          include: [
            {
              model: Wing,
              attributes: [],
              required: true,
              where: { societyId: societyId }, 
            },
          ],
        },
        {
          model: User,
          attributes: ['id'],
          required: true, 
          through: { 
            model: HouseUser,
            attributes: [],
            required: true,  
          },
          include: [
            {
              model: Role,
              attributes: [],
              required: true,  
              where: { name: 'owner' },
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching houses for society:", error);
    throw error; 
  }
};
