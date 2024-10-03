const { db } = require("../../config/connection");
const { User, HouseUser, House, Wing, Society, Floor,Role,UserRole } = db;

exports.getUserById = (id) => {
  return User.findOne({
    where: { id },
    attributes: {
      include: [
        "id",
        "email",
        "firstname",
        "lastname",
        "number",
        "passcode",
        "dateofbirth",
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
                include: [
                  {
                    model: Society,
                    as: "Society",
                    attributes: {
                      exclude: ["createdAt", "updatedAt"],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: Role, // Assuming Role model is defined and associated through userrole
        as: "Roles", // Alias for role association, adjust it as per your association
        through: {
          model: UserRole, // The through table that connects User and Role
          attributes: [],  // Exclude any unwanted attributes from UserRole table
        },
        attributes: ["id", "name"],  // Include only the role details you need
      },
    ],
  });
};


exports.updateUser = (userId, updateData) => {
  return User.update(updateData, { where: { id: userId } }).then(
    ([updated]) => {
      if (updated) {
        return User.findOne({ where: { id: userId } });
      }
      return null;
    }
  );
};

exports.findFamilyMembers = async (userId, houseId) => {
  const houseUser = await HouseUser.findOne({
    where: { UserId: userId, HouseId: houseId },
    attributes: ["HouseId"],
  });

  if (!houseUser) {
    return [];
  }

  const userHouseId = houseUser.HouseId;

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
