const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const userService = require("./userService");
const util = require('util');
const jwt = require("jsonwebtoken");

exports.getUserById = asyncErrorHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new CustomError('Authorization token missing or invalid', 401));
  }

  const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

  try {
    const decodedToken = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const id = decodedToken.id;
    const user = await userService.getUserById(id);

    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    next(new CustomError('Invalid or expired token', 401));
  }
});


exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.id;
  const updateData = req.body;
  console.log(updateData);
  try {
    const updatedUser = await userService.updateUser(userId, updateData);
    res.status(200).json({ status: "success", data:  updatedUser  });
  } catch (error) {
    next(error);
  }
});

exports.getFamilyMembers = asyncErrorHandler(async (req, res, next) => {
  const { userId } = req.params;
  try {
    const users = await userService.getFamilyMembers(userId);
    res.status(200).json({ status: "success", count: users.length, users });
  } catch (error) {
    next(error);
  }
});

exports.addFamilyMember = asyncErrorHandler(async (req, res, next) => {
  const { firstname, lastname, number, email, dateofbirth, houseId } = req.body;
  try {
    const newUser = await userService.addFamilyMember({
      firstname,
      lastname,
      number,
      email,
      dateofbirth,
      houseId,
    });
    res.status(201).json({ status: "success", data: { user: newUser } });
  } catch (error) {
    next(error);
  }
});

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const { userId, currentPassword, newPassword } = req.body;
  try {
    await userService.updatePassword({ userId, currentPassword, newPassword });
    res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
});
