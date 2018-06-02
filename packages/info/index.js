"use strict";

const envinfo = require("envinfo");

/**
 * Prints debugging information for webpack issue reporting
 */

module.exports = function info() {
	console.log(
		envinfo.run({
			System: ["OS", "CPU"],
			Binaries: ["Node", "Yarn", "npm"],
			Browsers: ["Chrome", "Firefox", "Safari"],
			npmPackages: "*webpack*",
			npmGlobalPackages: ["webpack", "webpack-cli"]
		})
	);
};
