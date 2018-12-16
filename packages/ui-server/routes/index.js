const express = require("express");
const router = express.Router();

router.use("/api", require("./api/index"));
/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index", { title: "Express" });
});

module.exports = router;
