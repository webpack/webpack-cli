/**
 * Endpoint for @webpack-cli/init
 */
const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
	const Q = require("../../utils/questioner").default;
	let questioner = new Q();

	questioner.start({
		action: "question",
		question: {
			question: "Do you want to start scaffold?",
			type: "Binary"
		}
	}).then((data) => {
		console.log(data);
		return questioner.question({ action: "exit" });
	});

	res.json({
		port: questioner.port,
		address: questioner.address
	});
});

module.exports = router;
