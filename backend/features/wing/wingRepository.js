const { db } = require("../../config/connection");
const { User, Wing, Society } = db;

exports.getWingDetailsById = async (wingId) => {
  try {
    const wingDetails = await Wing.findOne({
      where: { id: wingId },
      attributes: {
        exclude: ["wingAdminId", "createdAt", "updatedAt","societyId"],
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: {
            exclude: ["password","createdAt", "updatedAt","isMember","isOwner " ],
          },
        },
        {
          model: Society,
          as: "Society",
          include: [
            {
              model: User,
              as: "User",
              attributes: {
                exclude: ["password","createdAt", "updatedAt","isMember", "isOwner"],
              },
            },
          ],
        },
      ],
    });

    if (!wingDetails) {
      return {
        status: "error",
        message: "Wing not found",
      };
    }

    // Flatten the response and handle circular references
    const transformedWingDetails = {
      id: wingDetails.id,
      name: wingDetails.name,
      wingAdminId: wingDetails.wingAdminId,
      createdAt: wingDetails.createdAt,
      updatedAt: wingDetails.updatedAt,
      societyId: wingDetails.SocietyId,
      wingAdminDetails: wingDetails.User ? {
        id: wingDetails.User.id,
        firstname: wingDetails.User.firstname,
        lastname: wingDetails.User.lastname,
        number: wingDetails.User.number,
        email: wingDetails.User.email,
        isOwner: wingDetails.User.isOwner,
        isMember: wingDetails.User.isMember,
        createdAt: wingDetails.User.createdAt,
        updatedAt: wingDetails.User.updatedAt,
      } : null,
      societyDetails: wingDetails.Society ? {
        id: wingDetails.Society.id,
        name: wingDetails.Society.name,
        address: wingDetails.Society.address,
        adminDetails: wingDetails.Society.User ? {
          id: wingDetails.Society.User.id,
          firstname: wingDetails.Society.User.firstname,
          lastname: wingDetails.Society.User.lastname,
          number: wingDetails.Society.User.number,
          email: wingDetails.Society.User.email,
          isOwner: wingDetails.Society.User.isOwner,
          isMember: wingDetails.Society.User.isMember,
        } : null,
      } : null,
    };

    return transformedWingDetails;
  } catch (error) {
    throw new Error(error.message);
  }
};
