const { db } = require("../../config/connection");
const { User, HouseUser, House, Wing, Society } = db;

exports.getUserById = (id) => {
  return User.findOne({
    where: { id },
    attributes: {
      exclude: ['password'],
    },
    include: [
      {
        model: House,
        as: "Houses",
        include: [
          {
            model: Wing,
            as: "Wing",
            include: [
              {
                model: Society,
                as: "Society",
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
  const { firstname, lastname, number, email, dateofbirth, houseId } = userData;
  const newUser = await User.create({
    firstname,
    lastname,
    number,
    email,
    dateofbirth,
  });
  await HouseUser.create({ UserId: newUser.id, HouseId: houseId });
  return newUser;
};

exports.saveUser = (user) => {
  return user.save();
};
