const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const houseuserService = require("./houseusersSservice");

exports.getHouseDetails = asyncErrorHandler(async (req, res, next) => {
  const { id: houseId } = req.params;
  const HouseDetails = await houseuserService.getHouseDetails(houseId);
  res.status(200).json({
    status: "success",
    count: HouseDetails.length,
    data: { HouseDetails },
  });
});
