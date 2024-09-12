const { db, sequelize } = require("../config/connection");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { Sequelize, DataTypes } = require("sequelize");
const checkRecordExists = require("../utils/checkRecordExists");
const { Op } = Sequelize;

// getting the user model instance
const { User, House, HouseUser, Wing, Society } = db;

exports.getUserById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the user by ID and include related house, wing, and society details
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: House,
        as: "Houses",
        include: [
          {
            model: Wing,
            as: "Wing",
            include: [
              {
                model: Society,
                as: "Society",
              },
            ],
          },
        ],
      },
    ],
  });

  if (!user) {
    return next(new CustomError(`User with ID ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  //  Allowed fields for update
  const allowedUpdateFields = [
    "firstname",
    "lastname",
    "email",
    "number",
    "dateofbirth",
    "isOwner",
  ];

  // Disallowed fields for update
  const disallowedUpdateFields = ["createdAt", "updatedAt"];

  const userId = req.params.id;
  const updateData = req.body;

  // Check for disallowed fields in the request
  const attemptedUpdates = Object.keys(updateData);
  const disallowedFieldsAttempted = attemptedUpdates.filter((field) =>
    disallowedUpdateFields.includes(field)
  );

  if (disallowedFieldsAttempted.length > 0) {
    // If any disallowed fields are attempted to be updated, return an error
    return next(
      new CustomError(
        `You cannot update the following fields: ${disallowedFieldsAttempted.join(
          ", "
        )}`,
        400
      )
    );
  }

  // Filter only allowed fields
  const updateFields = {};
  allowedUpdateFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updateFields[field] = updateData[field];
    }
  });

  // Update user with only allowed fields
  const [updated] = await User.update(updateFields, { where: { id: userId } });

  if (updated) {
    const updatedUser = await User.findOne({ where: { id: userId } });
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } else {
    next(new CustomError("User not found", 404));
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
        attributes: [
          "dateofbirth",
          "email",
          "firstname",
          "lastname",
          "number",
          "id",
          "passcode",
          "isMember",
          "isOwner",
        ],
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
    return next(
      new CustomError(
        "User ID, current password, and new password are required",
        400
      )
    );
  }

  const user = await User.findByPk(userId);

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  if (!(await user.validPassword(currentPassword))) {
    return next(new CustomError("Current password is incorrect", 401));
  }

  if (currentPassword === newPassword) {
    return next(
      new CustomError(
        "New password cannot be the same as the current password",
        400
      )
    );
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});
