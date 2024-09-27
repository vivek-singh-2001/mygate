const { db } = require("../../config/connection");
const { User, Wing, Society, HouseUser, House } = db;
const { Op, fn, col } = db.Sequelize;

exports.getWingHouseDetailsById = async (wingId) => {
  try {
    // Get house details with user count
    const winghouseDetails = await House.findAll({
      where: { WingId: wingId },
      attributes: [
        "house_no",
        "id",
        [db.Sequelize.fn('COUNT', db.Sequelize.col('HouseUsers.UserId')), 'userCount']
      ],
      include: [
        {
          model: HouseUser,
          attributes: [], // We don't need to fetch HouseUser details
        }
      ],
      group: ['House.id'], // Group by House ID to get the count of users for each house
    });

    // Get owners for each house
    const housesWithOwners = await Promise.all(
      winghouseDetails.map(async (house) => {
        const owner = await HouseUser.findOne({
          where: {
            HouseId: house.id,
          },
          include: [
            {
              model: User,
              attributes: ["firstname", "lastname", "email", "number", "id"],
              where:{
                isOwner:true
              }
            }
          ]
        });

        return {
          ...house.toJSON(),
          owner: owner ? owner.User : null,
        };
      })
    );

    return housesWithOwners;
  } catch (e) {
    throw new Error(e.message);
  }
};
