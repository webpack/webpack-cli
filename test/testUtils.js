"use strict";

const path = require("path");
const execa = require("execa");
const { sync: spawnSync } = execa;
const { Writable } = require("readable-stream");

const WEBPACK_PATH = path.resolve(__dirname, "../bin/cli.js");

/**
 * Description
 *
 * @param {*} testCase The path to folder that contains the webpack.config.js
 * @param {*} args Array of arguments to pass to webpack
 * @returns {Object} The webpack output
 */
function run(testCase, args = []) {
	const cwd = path.resolve(testCase);

	const outputPath = path.resolve(testCase, "bin");
	const argsWithOutput = args.concat("--output-path", outputPath);

	const result = spawnSync(WEBPACK_PATH, argsWithOutput, {
		cwd,
		reject: false
	});

	// TODO: STRIP OUT THE OUTPUT
	result.stdout = removeTimeStrings(result.stdout);

	return result;
}

function runWatch(testCase, args = []) {
	const cwd = path.resolve(testCase);

	const outputPath = path.resolve(testCase, "bin");
	const argsWithOutput = args.concat("--output-path", outputPath);

	return new Promise(resolve => {
		const watchPromise = execa(WEBPACK_PATH, argsWithOutput, {
			cwd,
			reject: false
		});

		watchPromise.stdout.pipe(
			new Writable({
				write(chunk, encoding, callback) {
					const output = chunk.toString("utf8");

					if (output.includes("Time")) {
						watchPromise.kill();
					}

					callback();
				}
			})
		);
		watchPromise.then(result => {
			result.stdout = removeTimeStrings(result.stdout);
			resolve(result);
		});
	});
}

function removeTimeStrings(stdout) {
	if (stdout === "") {
		return "";
	}
	return stdout
		.split("\n")
		.filter(line => !line.includes("Hash"))
		.filter(line => !line.includes("Version"))
		.filter(line => !line.includes("Time"))
		.filter(line => !line.includes("Built at"))
		.join("\n");
}

function extractHash(stdout) {
	if (stdout === "") {
		return null;
	}

	let hashArray = stdout.match(/Hash.*\n/gm).map(hashLine => hashLine.replace(/Hash:(.*)/, "$1").trim());

	// If logs are full of errors and we don't find hash
	if (hashArray.length === 0) {
		return null;
	}

	let hashInfo = {
		hash: hashArray[0],
		config: []
	};

	// Multiple config were found
	if (hashArray.length > 1) {
		const childArray = stdout.match(/Child.*\n/gm).map(childLine => childLine.replace(/Child(.*):/, "$1").trim());

		// We don't need global hash anymore
		// so we'll remove it to maintain 1:1 parity between config and hash
		hashArray.shift();

		const configCount = childArray.length;
		for (let configIdx = 0; configIdx < configCount; configIdx++) {
			hashInfo["config"].push({
				name: childArray[configIdx],
				hash: hashArray[configIdx]
			});
		}
	}

	return hashInfo;
}

module.exports = { run, runWatch, extractHash };
