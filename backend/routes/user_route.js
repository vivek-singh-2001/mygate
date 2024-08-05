const express = require("express");
const user_controller = require("../controller/user_controller");

const router = express.Router();

router.route("/:id")
    .get(user_controller.getUserById)
    .patch(user_controller.updateUser)

module.exports = router;
