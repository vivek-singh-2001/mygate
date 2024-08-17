const { db } = require('../../config/connection');

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

exports.findUsersBySocietyAndWing = (societyId, wingName) => {
  const query = `
        SELECT * FROM GetUsersBySocietyAndWing($1, $2);
    `;
  const values = [societyId, wingName];

  return db.connectDB.query(query, {
    bind: values,
    type: db.Sequelize.QueryTypes.SELECT,
  });
};


// Get society by user ID
exports.getSocietyByUserId = async (userId) => {
  try {
    const query = `
      SELECT 
        s.id, s.name, s."createdAt", s."updatedAt"
      FROM 
        "Users" u
      JOIN 
        "HouseUsers" hu ON u.id = hu."UserId"
      JOIN 
        "Houses" h ON hu."HouseId" = h.id
      JOIN 
        "Wings" w ON h."WingId" = w.id
      JOIN 
        "Societies" s ON w."SocietyId" = s.id
      WHERE 
        u.id = $1;
    `;
    const values = [userId];

    const result = await db.connectDB.query(query, {
      bind: values,
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error('Error fetching society by user ID');
  }
};
