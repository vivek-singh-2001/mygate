const { db } = require("../../config/connection");
const { User, HouseUser, House, Wing, Society } = db;

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
        "isMember",
        "isOwner",
        "dateofbirth",
        "gender",
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

exports.findFamilyMembers = async (userId) => {
  const houseUser = await HouseUser.findOne({
    where: { UserId: userId },
    attributes: ["HouseId"],
  });

  if (!houseUser) {
    return [];
  }

  const houseId = houseUser.HouseId;

  return User.findAll({
    include: [
      {
        model: House,
        where: { id: houseId },
        attributes: [],
        through: { attributes: [] },
      },
    ],
  });
};

exports.createFamilyMember = async (userData) => {
  const {
    firstname,
    lastname,
    number,
    email,
    gender,
    isOwner,
    dateofbirth,
    houseId,
  } = userData;
  console.log(userData);
  try {
    const newUser = await User.create({
      firstname,
      lastname,
      number,
      email,
      gender,
      isOwner,
      dateofbirth,
    });

    await HouseUser.create({ UserId: newUser.id, HouseId: houseId });
    console.log('New user created:', newUser);
    return newUser
  } catch (error) {
    console.error('Error in createFamilyMember:', error);
    throw new Error(error);
  }
};

exports.saveUser = (user) => {
  return user.save();
};
