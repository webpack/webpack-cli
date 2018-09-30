"use strict";

const path = require("path");
const { sync: spawnSync } = require("execa");

const WEBPACK_PATH = path.resolve(__dirname, "../bin/cli.js");

function runWebpack(testCase, args) {
	const cwd = path.resolve(__dirname, "binCases", testCase);
	const outputPath = path.resolve(__dirname, "js/bin", testCase);
	const argsWithOutput = args.concat("--output-path", outputPath);

	const result = spawnSync(WEBPACK_PATH, argsWithOutput, {
		cwd,
		reject: false,
	});

	result.stdout = result.stdout === "" ? [] : result.stdout.split("\n");
	result.stderr = result.stderr === "" ? [] : result.stderr.split("\n");

	return result;
}

module.exports = runWebpack;
