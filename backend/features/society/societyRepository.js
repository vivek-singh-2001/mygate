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
