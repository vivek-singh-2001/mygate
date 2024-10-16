const { db } = require("../../config/connection");
const { User, HouseUser, House, Wing, Society, Floor, Role, UserRole, Staff } =
  db;

const staffRepository = {
  createStaff: async (staffData) => {
    const newStaff = await Staff.create({
      roleId: staffData.roleId,
      name: staffData.gaurdDetails.name,
      contactNumber: staffData.gaurdDetails.contactNumber,
      email: staffData.gaurdDetails.email,
      address: staffData.gaurdDetails.address,
      startDate: staffData.gaurdDetails.startDate,
      status: staffData.gaurdDetails.status,
      societyId: staffData.societyId,
      createdBy: staffData.createdBy,
    });
    console.log(newStaff);

  },

  getAllStaff: async () => {
    return await Staff.findAll();
  },

  getStaffById: async (id) => {
    return await Staff.findByPk(id);
  },

  updateStaff: async (id, updatedData) => {
    return await Staff.update(updatedData, { where: { id } });
  },

  deleteStaff: async (id) => {
    return await Staff.destroy({ where: { id } });
  },
};

module.exports = staffRepository;
