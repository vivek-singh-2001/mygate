const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const userService = require("./userService");
const util = require("util");
const jwt = require("jsonwebtoken");

exports.getUserById = asyncErrorHandler(async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(new CustomError("Authorization token missing or invalid", 401));
  }
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await userService.getUserById(decodedToken?.id);

  res.status(200).json({ status: "success", data: user });
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.id;
  const updateData = req.body;
  console.log(updateData);
  try {
    const updatedUser = await userService.updateUser(userId, updateData);
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
    next(error);
  }
});

exports.getFamilyMembers = asyncErrorHandler(async (req, res, next) => {
  const { userId, houseId } = req.params;
  const users = await userService.getFamilyMembers(userId, houseId);
  res.status(200).json({ status: "success", count: users.length, users });
});

exports.addFamilyMember = asyncErrorHandler(async (req, res, next) => {
  const { firstname, lastname, number, email, dateofbirth, houseId, isOwner } =
    req.body;
  try {
    const newUser = await userService.addFamilyMember({
      firstname,
      lastname,
      number,
      email,
      dateofbirth,
      houseId,
      isOwner,
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
