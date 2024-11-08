const societyRepository = require("./societyRepository");
const CustomError = require("../../utils/CustomError");
const userRepository = require("../users/userRepository");
const { parseCsvFile } = require("../../utils/csvFileParse");
const { db } = require("../../config/connection");
const sendEmail = require("../../utils/sendEmail");

exports.getUsersBySociety = async (societyId, limits, offsets, searchQuery) => {
  const users = await societyRepository.findUsersBySociety(
    societyId,
    limits,
    offsets,
    searchQuery
  );
  if (users.length === 0) {
    throw new CustomError(`No users found for Society ID ${societyId}`, 404);
  }

  return users;
};

exports.getUsersBySocietyAndWing = async (societyId, wingId) => {
  const users = await societyRepository.findUsersBySocietyAndWing(
    societyId,
    wingId
  );
  if (users.length === 0) {
    throw new CustomError(
      `No users found for Society ID ${societyId} and Wing ${wingName}`,
      404
    );
  }
  return users;
};

exports.getSocietyAdminsDetails = async (societyId) => {
  const users = await societyRepository.findSocietyAdminsDetails(societyId);

  if (users.length === 0) {
    throw new CustomError(`No users found for Society ID ${societyId} `, 404);
  }
  return users;
};

exports.isUserAdmin = async (userId) => {
  const society = await societyRepository.findSocietyByUserId(userId);
  return society;
};

exports.registerSociety = async (societyDetails) => {
  const pendingRole = await userRepository.getRoleByName("pending");

  const result = await societyRepository.registerSociety({
    societyDetails,
    status: "pending",
    pendingRole,
  });
  return result;
};

exports.getSocieties = async (status) => {
  const result = await societyRepository.getAllSocieties(status);
  return result;
};

exports.createSociety = async (csvData, societyId, userId, next) => {
  let transaction;

  try {
    transaction = await db.connectDB.transaction();

    const wingsArray = await parseCsvFile(csvData);
    if (!wingsArray) {
      return next(new CustomError("somethng wrong with csvFile", 400));
    }

    const result = await societyRepository.createSociety(
      wingsArray,
      societyId,
      userId,
      transaction
    );

    const currentRole = await userRepository.getRoleByName("pending");
    console.log("pending", currentRole);

    const newRole = await userRepository.getRoleByName("societyAdmin");
    console.log("societyAdmin", newRole);

    if (!currentRole || !newRole) {
      return next(new CustomError("Role not found", 400));
    }

    await userRepository.updateUserRole(
      userId,
      currentRole.id,
      newRole.id,
      transaction // Pass the transaction
    );

    // Send notification email
    const user = await userRepository.getUserById(userId);
    const email = user.email;
    const subject = "Welcome to Society Management!";
    const firstFourLettersOfFirstName = user.firstname
      .slice(0, 2)
      .toLowerCase();
    const birthYear = new Date(user.dateofbirth).getFullYear();
    const generatedPassword = `${firstFourLettersOfFirstName}-${firstFourLettersOfFirstName}@${birthYear}`;

    const message = `Hello ${user.firstname},\n\nYour society has been successfully created!\n\nYour login details:\nEmail: ${email}\nTemporary Password: ${generatedPassword}\n\nPlease log in to start managing your society.\n\nRegards,\nSociety Management Team`;

    await sendEmail(email, subject, message);

    // Commit the transaction
    await transaction.commit();

    return result;
  } catch (error) {
    console.log("Error creating society:", error);
    if (transaction) await transaction.rollback(); // Rollback on error
    return next(new CustomError("Error creating society", 500));
  }
};

exports.rejectSociety = async (societyId, userId) => {
  try {
    await userRepository.deleteUser(userId);

    await societyRepository.updateSocietyStatus(societyId, "rejected");

    return { message: "Society rejected and user deleted successfully" };
  } catch (error) {
    console.error("Error in rejecting society:", error);
    throw new Error(
      "Failed to reject society and delete user. Please try again."
    );
  }
};

exports.getStaffDetails = async (userId) => {
  return await societyRepository.getStaffDetails(userId);
};
