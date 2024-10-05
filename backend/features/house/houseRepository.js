const { db } = require("../../config/connection");
const { User, Wing, Society, HouseUser, House, Floor, UserRole } = db;
const { Op, fn, col } = db.Sequelize;

exports.getWingHouseDetailsById = async (wingId) => {
  try {
    const floors = await Floor.findAll({
      where: { wingId },
      attributes: ["id"],
    });

    if (!floors.length) return [];

    const floorIds = floors.map((floor) => floor.id);

    const winghouseDetails = await House.findAll({
      where: { floorId: floorIds },
      attributes: [
        "house_no",
        "id",
        [
          db.Sequelize.fn("COUNT", db.Sequelize.col("HouseUsers.userId")),
          "userCount",
        ],
      ],
      include: [
        {
          model: HouseUser,
          attributes: [],
          include: [
            {
              model: User,
              attributes: ["firstname", "lastname", "email", "number", "id"],
              // through: {
              //   model: UserRole,
              //   attributes: [],
              //   where: {
              //     roleId: db.Sequelize.literal(
              //       '(SELECT id FROM roles WHERE name = "owner")'
              //     ),
              //   },
              // },
            },
          ],
        },
      ],
      group: ["House.id", "HouseUsers->User.id"],
    });

    const formattedResults = winghouseDetails.map((house) => ({
      id: house.id,
      house_no: house.house_no,
      userCount: house.dataValues.userCount,
      owner: null,
    }));

    console.log("loggg", formattedResults);

    return formattedResults;
  } catch (e) {
    console.log(e);

    throw new Error(e.message);
  }
};
