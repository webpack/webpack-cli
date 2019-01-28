/* eslint-disable node/no-unpublished-require */
/**
 * Endpoint for @webpack-cli/init
 */
const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {

	const Config = require("../../../init/config").Config;
	const scaffoldProject = require("../../../init").scaffoldProject;
	const Questioner = require("../../utils/questioner").default;

	let config = new Config();
	let questioner = new Questioner();

	const dependencies = [
		"webpack",
		"webpack-cli",
		"uglifyjs-webpack-plugin",
		"babel-plugin-syntax-dynamic-import",
	];

	config.pushToTopScope(
		"const webpack = require('webpack')",
		"const path = require('path')",
		"\n"
	);

	config.setWebpackOption("module",{
		rules: []
	});

	questioner.start({
		action: "question",
		question: "A dummy question for reference"
	}).then((data) => {
		scaffoldProject(dependencies,config.exportConfig());
		return questioner.question({ action: "exit" });
	});

	res.json({
		port: questioner.port,
		address: questioner.address
	});
});

module.exports = router;
