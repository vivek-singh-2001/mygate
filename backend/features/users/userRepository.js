const { db } = require("../../config/connection");
const { User, HouseUser, House, Wing, Society, Floor, Role, UserRole } = db;

exports.getUserById = (id) => {
  return User.findOne({
    where: { id },
    attributes: {
      exclude: [
        "createdAt",
        "otp",
        "otpExpiry",
        "password",
        "passwordChangedAt",
        "passwordResetToken",
        "passwordResetTokenExpires",
        "updatedAt",
      ],
    },
    include: [
      {
        model: House,
        as: "Houses",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Floor,
            as: "Floor",
            include: [
              {
                model: Wing,
                as: "Wing",
                attributes: ["id", "name", "societyId"],
                include: [
                  {
                    model: Society,
                    as: "Society",
                    attributes: ["id", "name", "address"],
                  },
                ],
              },
            ],
          },
        ],
      },  
      {
        model: Role,
        as: "Roles",
        through: {
          model: UserRole,
          attributes: [],
        },
        attributes: ["id", "name"],
      },
      {
        model:Society,
        as:"Societies",
        attributes: ["id", "name", "address"],
      }
    ],
  });
};

exports.findById = async (id) => {
  return await User.findOne({
    where: { id },
  });
};

exports.updateUser = async (userId, updateData) => {
  return await User.update(updateData, { where: { id: userId } }).then(
    ([updated]) => {
      if (updated) {
        return User.findOne({ where: { id: userId } });
      }
      return null;
    }
  );
};

exports.deleteUser = async (userId) => {
  try {
    console.log(userId);

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await User.destroy({ where: { id: userId } });
    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw error;
  }
};

exports.findFamilyMembers = async (userId, houseId) => {
  const houseUser = await HouseUser.findOne({
    where: { userId, houseId },
    attributes: ["houseId"],
  });

  if (!houseUser) {
    return [];
  }

  const userHouseId = houseUser.houseId;

  return User.findAll({
    include: [
      {
        model: House,
        where: { id: userHouseId },
        attributes: [],
        through: { attributes: [] },
      },
    ],
  });
};

exports.createFamilyMember = async (userData) => {
  const { firstname, lastname, number, email, dateofbirth, houseId, isOwner } =
    userData;
  const newUser = await User.create({
    firstname,
    lastname,
    number,
    email,
    dateofbirth,
    isOwner,
  });
  await HouseUser.create({ UserId: newUser.id, HouseId: houseId });
  return newUser;
};

exports.saveUser = (user) => {
  return user.save();
};

exports.getAllRoles = async () => {
  try {
    const roles = await Role.findAll({
      attributes: ["id", "name"],
    });

    const jsonResponse = roles.map((role) => role.dataValues);

    return jsonResponse;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};
