const { db } = require("../../config/connection");
const CustomError = require("../../utils/CustomError");
const userRepository = require("../users/userRepository");
const { User, HouseUser, House, Wing, Society, Floor, Role, UserRole, Staff } =
  db;

const staffRepository = {
  createStaff: async (staffData) => {
   const  transaction = await db.connectDB.transaction();

    try {
      const newStaff = await User.create(
        {
          firstname: staffData.firstname,
          lastname: staffData.lastname,
          number: staffData.contactNumber,
          email: staffData.email,
          dateofbirth: staffData.dateofbirth,
        },
        { transaction }
      );

      const roleToAssign = await userRepository.getRoleByName(
        staffData.role.name
      );
      await UserRole.create(
        {
          userId: newStaff.id,
          roleId: roleToAssign.id,
        },
        { transaction }
      );
      await transaction.commit()

      return newStaff;
    } catch (error) {
      console.log(error);
      
      await transaction.rollback();
      throw new CustomError(error.message || "Failed to create staff", 500);
    }
  },

  getAllStaff: async (societyId) => {
    return await Staff.findAll({
      where: { societyId: societyId },
    });
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
