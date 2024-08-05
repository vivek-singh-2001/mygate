const express = require("express");
const society_controller = require("../controller/society_controller");

const router = express.Router();

router.route("/:societyId").get(society_controller.getUsersBySociety);
router.route("/:societyId/:wingName").get(society_controller.getUsersBySocietyAndWing);

module.exports = router;
