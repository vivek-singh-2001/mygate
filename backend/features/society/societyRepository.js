const { db } = require("../../config/connection");
const { Sequelize } = require("sequelize");
const CustomError = require("../../utils/CustomError");
const {
  User,
  HouseUser,
  House,
  Wing,
  Society,
  Floor,
  Role,
  UserRole,
  SocietyStaff,
} = db;

exports.getsocietyById = async (societyId) => {
  const society = await Society.findByPk(societyId);
  if (!society) {
    throw new CustomError("society not found", 404);
  }
  return society;
};

exports.findUsersBySociety = (
  societyId,
  limits = null,
  offsets = 0,
  searchQuery = null
) => {
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
    where: { societyId },
    attributes: [
      "id",
      "name",
      [
        Sequelize.fn(
          "COUNT",
          Sequelize.fn("DISTINCT", Sequelize.col("Floors->Houses.id"))
        ),
        "numberOfHouses",
      ],
      [
        Sequelize.fn(
          "COUNT",
          Sequelize.fn(
            "DISTINCT",
            Sequelize.col("Floors->Houses->HouseUsers.id")
          )
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
        model: Floor,
        as: "Floors",
        attributes: [],
        include: [
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
      },
    ],
    group: ["Wing.id", "User.id"],
  });
};

exports.findSocietyByUserId = async (userId) => {
  return await Society.findOne({ where: { societyAdminId: userId } });
};

exports.updateSocietyStatus = async (societyId, newStatus) => {
  try {
    const society = await Society.findByPk(societyId);

    if (!society) {
      throw new Error("Society not found");
    }

    await society.update({ status: newStatus });

    return { message: "Society status updated successfully", society };
  } catch (error) {
    console.error("Error updating society status:", error.message);
    throw error;
  }
};

exports.registerSociety = async (societyDetails, status, pendingRole) => {
  const transaction = await db.connectDB.transaction();
  try {
    // Create the user within the transaction

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

    await UserRole.create(
      {
        userId: user.id,
        roleId: societyDetails.pendingRole.id,
      },
      { transaction }
    );

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
          model: User,
        },
      ],
    });
    return societies;
  } catch (error) {
    console.error("Error fetching societies: ", error);
    throw error;
  }
};

exports.createSociety = async (wingsArray, societyId, userId, transaction) => {
  const createdData = [];
  try {
    for (let wing of wingsArray) {
      const newWing = await Wing.create(
        { name: wing.name, societyId: societyId },
        { transaction }
      );

      const wingId = newWing.id;

      const wingData = {
        wingId: newWing.id,
        wingName: newWing.name,
        floors: [],
      };

      for (const floor of wing.floors) {
        const newFloor = await Floor.create(
          { floor_number: floor.number, wingId: wingId },
          { transaction }
        );

        const floorId = newFloor.id;

        console.log("floor created", floorId);

        const floorData = {
          floorId: newFloor.id,
          floorNumber: newFloor.floor_number,
          houses: [],
        };

        const startingHouseNumber = parseInt(floor.number) * 100 + 1;

        for (let i = 0; i < floor.houses; i++) {
          const houseNumber = startingHouseNumber + i;

          const newHouse = await House.create(
            { house_no: houseNumber, floorId: floorId },
            { transaction }
          );

          floorData.houses.push({
            houseId: newHouse.id,
            houseNumber: newHouse.house_no,
          });
        }

        wingData.floors.push(floorData);
      }
      createdData.push(wingData);
    }

    await Society.update(
      { status: "approved" },
      { where: { id: societyId } },
      { transaction }
    );

    return {
      societyId: societyId,
      wings: createdData,
    };
  } catch (error) {
    console.log("Error creating society and its related data:", error);
    if (transaction) await transaction.rollback();
    throw error;
  }
};

exports.getStaffDetails = async (userId) => {
  const staffData = await SocietyStaff.findOne({
    where: { staffId: userId },
    attributes: ['id','staffId',"societyId","createdAt","updatedAt"],
    include: [
      {
        model: Society,
        as:'Society',
        attributes:['name']
      },
    ],
  });
  return staffData
};
