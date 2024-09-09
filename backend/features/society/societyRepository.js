const { IncomingClientScope } = require("twilio/lib/jwt/ClientCapability");
const { db } = require("../../config/connection");
const { User, HouseUser, House, Wing, Society } = db;

exports.findUsersBySociety = (societyId) => {
  const query = `
        SELECT * FROM GetUsersBySociety($1);
    `;
  const values = [societyId];

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
    attribute: [],
    include: [
      {
        model: User,
        as: "User",
        attributes: ["firstname", "lastname", "email", "number","id"],
      },
    ],
  });
};
