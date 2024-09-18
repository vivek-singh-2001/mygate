const { IncomingClientScope } = require("twilio/lib/jwt/ClientCapability");
const { db } = require("../../config/connection");
const { Sequelize } = require("sequelize");
const { User, HouseUser, House, Wing, Society } = db;

exports.findUsersBySociety = (societyId,limits,offsets,searchQuery) => {
  const query = `
        SELECT * FROM GetUsersBySociety($1,$2,$3,$4);
    `;
  const values = [societyId,limits,offsets, searchQuery || ''];

  return db.connectDB.query(query, {
    bind: values,
    type: db.Sequelize.QueryTypes.SELECT,
  });
};

exports.findUsersBySocietyAndWing = (societyId, wingId) => {
  const query = `
        SELECT * FROM GetUsersBySocietyAndWing($1, $2);
    `;
  const values = [societyId, wingId];

  return db.connectDB.query(query, {
    bind: values,
    type: db.Sequelize.QueryTypes.SELECT,
  });
};
  
exports.findSocietyAdminsDetails = async (societyId) => {
  return await Wing.findAll({
    where: { SocietyId: societyId },
    attributes: [
      "id",
      "name",
      [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("Houses.id"))), "numberOfHouses"],
      [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("Houses->HouseUsers.id"))), "numberOfUsers"]
    ],
    include: [
      {
        model: User,
        as: "User",
        attributes: ["firstname", "lastname", "email", "number","id"],
      },
      {
        model: House,
        as: "Houses",
        attributes: [],
        include: [
          {
            model: HouseUser,
            as: "HouseUsers",
            attributes: [],  // Only counting users, no need to fetch data
          },
        ],
      },
    ],
    group: ["Wing.id", "User.id"],
  });
};

exports.findSocietyByUserId = async(userId)=>{
  return await Society.findOne({ where: { societyAdminId:userId } });
}




