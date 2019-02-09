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
	const entryQuestions = require("./_entry.js");
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
		question: "Will your application have multiple bundles?"
	}).then((answer) => {
		return entryQuestions(questioner, answer);
	}).then((entryOptions) => {
		if (entryOptions !== "\"\"") {
			config.setWebpackOption("webpackOptions", {
				entry: entryOptions,
			});
		}
		return questioner.question({
			action: "question",
			question: "Which folder will Which folder will your generated bundles be in? [default: dist]"
		});
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
