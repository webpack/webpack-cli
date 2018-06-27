"use strict";

const envinfo = require("envinfo");

/**
 * Prints debugging information for webpack issue reporting
 */

/* eslint-disable node/no-unsupported-features */
module.exports = async function info() {
	console.log(
		await envinfo.run({
			System: ["OS", "CPU"],
			Binaries: ["Node", "Yarn", "npm"],
			Browsers: ["Chrome", "Firefox", "Safari"],
			npmPackages: "*webpack*",
			npmGlobalPackages: ["webpack", "webpack-cli"]
		})
	);
};
/* eslint-enable node/no-unsupported-features */
