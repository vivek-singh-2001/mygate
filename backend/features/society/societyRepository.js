const { db } = require("../../config/connection");
const { Sequelize } = require("sequelize");
const CustomError = require("../../utils/CustomError");
const { User, HouseUser, House, Wing, Society, Floor } = db;

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
  console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  
  console.log("Received societyId:", societyId); // Log the input societyId

    // Log associations for debugging
    console.log("User associations:", db.User.associations);
    console.log("House associations:", db.House.associations);
    console.log("HouseUser associations:", db.HouseUser.associations);
    console.log("wings associations:", db.Wing.associations);

  try {
    const result = await Wing.findAll({
      where: { societyId }, // Ensure correct casing of societyId
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
            Sequelize.fn("DISTINCT", Sequelize.col("HouseUsers.id"))
          ),
          "numberOfUsers",
        ],
      ],
      include: [
        {
          model: User,
          as: "User", // Check if this matches the association definition
          attributes: ["firstname", "lastname", "email", "number", "id"],
        },
        {
          model: Floor,
          as: "Floors", // Check if this matches the association definition
          attributes: [],
          include: [
            {
              model: House,
              as: "Houses", // Check if this matches the association definition
              attributes: [],
              include: [
                {
                  model: HouseUser,
                  as: "HouseUsers", // Check if this matches the association definition
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
      group: ["Wing.id", "User.id", "Floors.id", "Floors->Houses.id"],
    });

    console.log("Query result:", result); // Log the result of the query
    return result;

  } catch (error) {
    console.error("Error executing findSocietyAdminsDetails:", error); // Log any errors
    throw error; // Rethrow the error for further handling if needed
  }
};

exports.findSocietyByUserId = async (userId) => {
  return await Society.findOne({ where: { societyAdminId: userId } });
};

exports.registerSociety = async (societyDetails, status) => {
  const transaction = await db.connectDB.transaction();
  try {
    // Create the user within the transaction
    console.log({
      firstname: societyDetails.societyDetails.firstname,
      lastname: societyDetails.societyDetails.lastname,
      email: societyDetails.societyDetails.email,
      number: societyDetails.societyDetails.number,
    });

    const user = await User.create(
      {
        firstname: societyDetails.societyDetails.firstname,
        lastname: societyDetails.societyDetails.lastname,
        email: societyDetails.societyDetails.email,
        number: societyDetails.societyDetails.number,
        dateofbirth: societyDetails.societyDetails.dateofbirth,
      },
      { transaction }
    );

    console.log(user);

    const society = await Society.create(
      {
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
      },
      { transaction }
    );

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

exports.getAllSocieties = async (status) => {
  const filter = {};

  // If status is provided, add it to the filter object
  if (status) {
    filter.status = status;
  }

  try {
    const societies = await Society.findAll({
      where: filter,
      include: [
        {
          model: User, // Assuming the User model is associated with Society
        },
      ],
    });
    return societies;
  } catch (error) {
    console.error("Error fetching societies: ", error);
    throw error;
  }
};
