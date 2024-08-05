const { db, sequelize } = require("../config/connection");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { Sequelize, DataTypes, where } = require("sequelize");
const checkRecordExists = require("../utils/checkRecordExists");
const { Op } = Sequelize;

// getting the db models instances
const { User, House, HouseUser } = db;

exports.getAllUser = asyncErrorHandler(async (req, res, next) => {
  // Extract query parameters from request
  const { search } = req.query;

  // Build search query
  const whereClause = search
    ? {
        [Op.or]: [
          { firstname: { [Op.iLike]: `%${search}%` } },
          { number: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  // Fetch users based on search query
  const users = await User.findAll({ where: whereClause });

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

// Fetch users by society ID
exports.getUsersBySociety = asyncErrorHandler(async (req, res, next) => {
  const { societyId } = req.params;

  if (!societyId) {
    return next(new CustomError("Society ID is required", 400));
  }

  const query = `
      SELECT * FROM GetUsersBySociety($1);
  `;
  const values = [societyId];

  try {
    const results = await db.connectDB.query(query, {
      bind: values,
      type: db.Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({
      status: "success",
      data: {
        users: results,
      },
    });
  } catch (error) {
    next(error);
  }

  //  using sequelize
  //   const { societyId } = req.params;

  //   if (!societyId) {
  //     return next(new CustomError("Society ID is required", 400));
  //   }

  //   try {
  //     const users = await db.User.findAll({
  //       attributes: [
  //         "id",
  //         "firstname",
  //         "lastname",
  //         "email",
  //         "number",
  //         "isOwner",
  //         "isAdmin",
  //         "isWINGADMIN",
  //         "isMEMBER",
  //       ],
  //       include: [
  //         {
  //           model: db.House,
  //           attributes: ["house_no"],
  //           include: [
  //             {
  //               model: db.Wing,
  //               attributes: ["name"],
  //               where: { SocietyId: societyId },
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     res.status(200).json({
  //       status: "success",
  //       data: {
  //         users,
  //       },
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
});

// Fetch users by society ID and wing name
exports.getUsersBySocietyAndWing = asyncErrorHandler(async (req, res, next) => {
  const { societyId, wingName } = req.params;

  if (!societyId || !wingName) {
    return next(new CustomError("Society ID and Wing Name are required", 400));
  }

  const query = `
        SELECT * FROM GetUsersBySocietyAndWing($1, $2);
    `;
  const values = [societyId, wingName];

  try {
    const results = await db.connectDB.query(query, {
      bind: values,
      type: db.Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({
      status: "success",
      data: {
        users: results,
      },
    });
  } catch (error) {
    next(error);
  }
});

//Fetch family members of a user
exports.getFamilyMembers = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!(await checkRecordExists("User", userId))) {
    return next(new CustomError("Invalid user id", 400));
  }

  const houseUser = await HouseUser.findOne({
    where: { UserId: userId },
    attributes: ["HouseId"],
  });

  if (!houseUser) {
    return next(new CustomError("House not found for the given user ID", 404));
  }
  const houseId = houseUser.HouseId;

  const users = await User.findAll({
    include: [
      {
        model: House,
        where: {
          id: houseId,
        },
        attributes: [],
        through: { attributes: [] },
      },
    ],
  });

  res.status(200).json({
    status: "success",
    count: users.length,
    users,
  });
});

exports.addFamilyMember = asyncErrorHandler(async (req, res, next) => {
  const { firstname, lastname, number, email, dateofbirth, houseId } = req.body;

  if (!firstname || !lastname || !number || !email || !dateofbirth) {
    return next(new CustomError("All the parameters must be provided", 400));
  }

  try {
    const newUser = await User.create({
      firstname,
      lastname,
      number,
      email,
      dateofbirth,
    });

    await HouseUser.create({
      UserId: newUser.id,
      HouseId: houseId,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
        return next(new CustomError('User ID, current password, and new password are required', 400))
    }

    const user = await User.findByPk(userId);

    if (!user) {
        return next(new CustomError('User not found', 404))
    }

    if (!user.validPassword(currentPassword)) {
        return next(new CustomError("Current password is incorrect", 401));
    }

    if (currentPassword === newPassword) {
        return next(new CustomError("New password cannot be the same as the current password", 400));
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully'
    });
})
