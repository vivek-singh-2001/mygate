const userRepository = require("./userRepository");
const CustomError = require("../../utils/CustomError");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");

exports.getUserById = async (id) => {
  const user = await userRepository.getUserById(id);
  const userData = user.toJSON();
  if (!userData) {
    throw new CustomError(`User with ID ${id} not found`, 404);
  }
  return userData;
};

exports.updateUser = async (userId, updateData) => {
  // Check if updateData is empty
  if (Object.keys(updateData).length === 0) {
    throw new CustomError("No update data provided", 400);
  }

  // Allowed fields for update
  const allowedUpdateFields = [
    "firstname",
    "lastname",
    "email",
    "number",
    "dateofbirth",
  ];

  // Filter only allowed fields
  const validFields = {};
  Object.keys(updateData).forEach((field) => {
    if (allowedUpdateFields.includes(field)) {
      validFields[field] = updateData[field];
    }
  });

  // Check if validFields is empty
  if (Object.keys(validFields).length === 0) {
    throw new CustomError("No valid fields provided for update", 400);
  }

  const updatedUser = await userRepository.updateUser(userId, validFields);
  if (!updatedUser) {
    throw new CustomError("User not found", 404);
  }
  return updatedUser;
};

exports.deleteUser = async (userId)=> {

  if (!userId) {
    throw new CustomError("User not Found", 400);
  }
  const deleteUser = await userRepository.deleteUser(userId);

  return deleteUser;
}

exports.getFamilyMembers = async (userId, houseId) => {
  if (!userId || !houseId) {
    throw new CustomError("UserId and houseId are required", 400);
  }
  const users = await userRepository.findFamilyMembers(userId, houseId);
  if (users.length === 0) {
    throw new CustomError("No family members found", 404);
  }
  return users;
};

exports.addFamilyMember = async (userData) => {
  const newUser = await userRepository.createFamilyMember(userData);
  if (!newUser) {
    throw new CustomError("Error adding family member", 500);
  }
  return newUser;
};

exports.updatePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (!(await user.validPassword(currentPassword))) {
    throw new CustomError("Current password is incorrect", 401);
  }

  if (currentPassword === newPassword) {
    throw new CustomError(
      "New password cannot be the same as the current password",
      400
    );
  }

  user.password = newPassword;
  await userRepository.saveUser(user);
};
