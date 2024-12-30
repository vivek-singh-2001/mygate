const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const db = require("../../config/connection");
const { Op } = require("sequelize");

exports.cleanup = asyncErrorHandler(async (req, res) => {
  const { tableName, filter } = req.body;
  try {
    if (!["Visitor", "Users", "Payments", "Posts"].includes(tableName)) {
      return res.status(400).json({ error: "Invalid table name" });
    }

    const Model = db.db[tableName];

    if (!Model) {
      return res.status(404).json({ error: "Model not found" });
    }

    const sequelizeFilter = Object.fromEntries(
      Object.entries(filter).map(([key, condition]) => {
        const sequelizeOperator = Op[condition.operator];
        if (!sequelizeOperator) {
          throw new Error(`Invalid operator: ${condition.operator}`);
        }
        return [key, { [sequelizeOperator]: condition.value }];
      })
    );

    await Model.destroy({ where: sequelizeFilter });

    res
      .status(200)
      .json({ message: `Test data from ${tableName} cleaned up successfully` });
  } catch (error) {
    console.error("Error during test data cleanup:", error);
    res.status(500).json({ error: "Test data cleanup failed" });
  }
});
