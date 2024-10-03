const { db } = require("../../config/connection");
const { Sequelize } = require("sequelize");
const CustomError = require("../../utils/CustomError");
const { User, HouseUser, House, Wing, Society } = db;

exports.findUsersBySociety = (societyId, limits, offsets, searchQuery) => {
  const query = `
        SELECT * FROM GetUsersBySociety($1,$2,$3,$4);
    `;
  const values = [societyId, limits, offsets, searchQuery || ""];

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
      [
        Sequelize.fn(
          "COUNT",
          Sequelize.fn("DISTINCT", Sequelize.col("Houses.id"))
        ),
        "numberOfHouses",
      ],
      [
        Sequelize.fn(
          "COUNT",
          Sequelize.fn("DISTINCT", Sequelize.col("Houses->HouseUsers.id"))
        ),
        "numberOfUsers",
      ],
    ],
    include: [
      {
        model: User,
        as: "User",
        attributes: ["firstname", "lastname", "email", "number", "id"],
      },
      {
        model: House,
        as: "Houses",
        attributes: [],
        include: [
          {
            model: HouseUser,
            as: "HouseUsers",
            attributes: [], // Only counting users, no need to fetch data
          },
        ],
      },
    ],
    group: ["Wing.id", "User.id"],
  });
};

exports.findSocietyByUserId = async (userId) => {
  return await Society.findOne({ where: { societyAdminId: userId } });
};

exports.registerSociety = async (societyDetails, status) => {
  const transaction = await db.connectDB.transaction();
  try {
    // Create the user within the transaction
    console.log({
      firstname:societyDetails.societyDetails.firstname,
      lastname:societyDetails.societyDetails.lastname,
      email:societyDetails.societyDetails.email,
      number:societyDetails.societyDetails.number,
    });
    
    const user = await User.create({
      firstname: societyDetails.societyDetails.firstname,
      lastname: societyDetails.societyDetails.lastname,
      email: societyDetails.societyDetails.email,
      number: societyDetails.societyDetails.number,
      dateofbirth:societyDetails.societyDetails.dateofbirth
    }, { transaction });

    console.log(user);
    

    const society = await Society.create({
      name: societyDetails.societyDetails.address.s_name,
      address: {
        street: societyDetails.societyDetails.address.street,
        city: societyDetails.societyDetails.address.city,
        zip: societyDetails.societyDetails.address.postal,
        state: societyDetails.societyDetails.address.state,
        country: societyDetails.societyDetails.address.country,
      },
      societyAdminId: user.id,
      status: societyDetails.status,
      csvData: societyDetails.societyDetails.filePath,
    }, { transaction });

    // Commit the transaction if both operations were successful
    await transaction.commit();

    return society;
  } catch (error) {
    // Roll back the transaction in case of error
    await transaction.rollback();
    console.error("Error registering society:", error);
    throw new CustomError(error.message || "Failed to register society", 500);
  }
};