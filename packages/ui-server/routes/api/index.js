const express = require("express");
const router = express.Router();

router.use("/init", require("./init"));

module.exports = router;
