// services/staffService.js
const staffRepository = require("./staffRepository");
const { db } = require("../../config/connection");
const societyRepository = require("../society/societyRepository");
const CustomError = require("../../utils/CustomError");

const staffService = {
  createStaff: async (staffData, next) => {

    try {
      const newStaff = await staffRepository.createStaff(
        staffData,
      );
      return newStaff;
    } catch (error) {
      console.log("Error creating staff:", error);
     
      return next(new CustomError("Error creating staff", 500));
    }
  },

  getAllStaff: async (societyId) => {
    const societyUsers = await societyRepository.findUsersBySociety(societyId)
    return await staffRepository.getAllStaff(societyUsers);
  },

  getStaffById: async (id) => {
    return await staffRepository.getStaffById(id);
  },

  updateStaff: async (id, updatedData) => {
    return await staffRepository.updateStaff(id, updatedData);
  },

  deleteStaff: async (id) => {
    return await staffRepository.deleteStaff(id);
  },
};

module.exports = staffService;
