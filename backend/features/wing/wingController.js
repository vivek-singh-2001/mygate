const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const wingService = require("./wingService");


exports.getWingDetils = asyncErrorHandler(async (req, res, next) => {
    
    const { wingId } = req.params;
  
    try {
        const wingDetails= await wingService.getWingDetils(wingId);
        res.status(200).json({ status: "success", data: { wingDetails } });
      } catch (error) {
        next(error);
      }
  });