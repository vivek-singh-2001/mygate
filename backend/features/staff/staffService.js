// services/staffService.js
const staffRepository = require('./staffRepository');

const staffService = {
  createStaff: async (staffData) => {
    return await staffRepository.createStaff(staffData);
  },

  getAllStaff: async () => {
    return await staffRepository.getAllStaff();
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
