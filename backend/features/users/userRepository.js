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
        'dateofbirth'
      ],
    },
    include: [
      {
        model: House,
        as: "Houses",
        attributes: {
          exclude: ['createdAt', 'updatedAt']
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
                  exclude: [
                    'createdAt',
                    'updatedAt'
                  ]
                }
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
  const { firstname, lastname, number, email, dateofbirth, houseId ,isOwner} = userData;
  const newUser = await User.create({
    firstname,
    lastname,
    number,
    email,
    dateofbirth,
    isOwner
  });
  await HouseUser.create({ UserId: newUser.id, HouseId: houseId });
  return newUser;
};

exports.saveUser = (user) => {
  return user.save();
};
