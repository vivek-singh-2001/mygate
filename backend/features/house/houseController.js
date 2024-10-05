const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const houseService = require("./houseService");

exports.getWingHouseDetails = asyncErrorHandler(async (req, res, next) => {
  const { id: wingId } = req.params;

  try {
    const wingHouseDetails = await houseService.getWingHouseDetails(wingId);
    res
      .status(200)
      .json({
        status: "success",
        count: wingHouseDetails.length,
        data: { wingHouseDetails },
      });
  } catch (error) {
    next(error);
  }
});
