const { db } = require("../../config/connection");
const { User, Wing, Society,HouseUser , House} = db;


exports.getWingHouseDetailsById = async (wingId) =>{
    try{
        const winghouseDetails = await House.findAll({
            where: { WingId: wingId },
            attributes: ["house_no", "id"],
            include: [
              {
                model: HouseUser,
                attributes: [[db.Sequelize.fn('COUNT', db.Sequelize.col('HouseUser.id')), 'userCount']],
                group: ['HouseId'],
              },
            ],
          });
      
          return winghouseDetails.map((house) => ({
            ...house.dataValues,
            userCount: house.HouseUsers[0]?.dataValues.userCount || 0,
          }));
    }catch(e){
        throw new Error(e.message);
    }
}