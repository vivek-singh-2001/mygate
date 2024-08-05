const {db,sequelize} = require('../config/connection');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const { Sequelize, DataTypes } = require("sequelize");
const checkRecordExists = require("../utils/checkRecordExists");
const {Op} = Sequelize

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
        as: 'Houses',
        include: [
          {
            model: Wing,
            as: 'Wing',
            include: [
              {
                model: Society,
                as: 'Society',
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
    status: 'success',
    data: {
      user,
    },
  });
});




exports.updateUser = asyncErrorHandler(async (req, res, next) => {


 //  Allowed fields for update
    const allowedUpdateFields = ['firstname', 'lastname', 'email', 'number', 'dateofbirth'];
    
 // Disallowed fields for update
    const disallowedUpdateFields = ['isAdmin', 'isWINGADMIN', 'isMEMBER', 'createdAt', 'updatedAt','isowner'];

  const userId = req.params.id;
  const updateData = req.body;

  // Check for disallowed fields in the request
  const attemptedUpdates = Object.keys(updateData);
  const disallowedFieldsAttempted = attemptedUpdates.filter(field => disallowedUpdateFields.includes(field));

  if (disallowedFieldsAttempted.length > 0) {
    // If any disallowed fields are attempted to be updated, return an error
    return next(new CustomError(`You cannot update the following fields: ${disallowedFieldsAttempted.join(', ')}`, 400));
  }

  // Filter only allowed fields
  const updateFields = {};
  allowedUpdateFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updateFields[field] = updateData[field];
    }
  });

  // Update user with only allowed fields
  const [updated] = await User.update(updateFields, { where: { id: userId } });

  if (updated) {
    const updatedUser = await User.findOne({ where: { id: userId } });
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } else {
    next(new CustomError('User not found', 404));
  }
});