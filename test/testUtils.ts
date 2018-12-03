"use strict";
import * as execa from "execa";
import * as path from "path";
import { Writable } from "readable-stream";

const { sync: spawnSync } = execa;

const WEBPACK_PATH = path.resolve(__dirname, "../bin/cli.js");

export interface IHash extends Object {
	hash: string;
	name: string;
}

export interface IHashInfo extends Object {
	config?: IHash[];
	hash: string;
}

/**
 * Description
 *
 * @param {string} testCase The path to folder that contains the webpack.config.js
 * @param {Array} args Array of arguments to pass to webpack
 * @returns {Object} The webpack output
 */
function run(testCase: string, args = []): any {
	const cwd = path.resolve(testCase);

	const outputPath = path.resolve(testCase, "bin");
	const argsWithOutput = args.concat("--output-path", outputPath);

	const result = spawnSync(WEBPACK_PATH, argsWithOutput, {
		cwd,
		reject: false,
	});

	// TODO: STRIP OUT THE OUTPUT
	result.stdout = removeTimeStrings(result.stdout);

	return result;
}

function runWatch(testCase: string, args = []) {
	const cwd = path.resolve(testCase);

	const outputPath = path.resolve(testCase, "bin");
	const argsWithOutput = args.concat("--output-path", outputPath);

	return new Promise((resolve) => {
		const watchPromise = execa(WEBPACK_PATH, argsWithOutput, {
			cwd,
			reject: false,
		});

		watchPromise.stdout.pipe(
			new Writable({
				write(chunk, encoding, callback) {
					const output = chunk.toString("utf8");

					if (output.includes("Time")) {
						watchPromise.kill();
					}

					callback();
				},
			}),
		);
		watchPromise.then((result) => {
			result.stdout = removeTimeStrings(result.stdout);
			resolve(result);
		});
	});
}

function removeTimeStrings(stdout: string): string {
	if (stdout === "") {
		return "";
	}
	return stdout
		.split("\n")
		.filter((line: string) => !line.includes("Hash"))
		.filter((line: string) => !line.includes("Version"))
		.filter((line: string) => !line.includes("Time"))
		.filter((line: string) => !line.includes("Built at"))
		.join("\n");
}

/**
 * @typedef {Object} Config
 * @property {string} name - name of config
 * @property {string} hash - hash of config
 *
 * @typedef {Object} HashInfo
 * @property {string} hash - global hash value
 * @property {Array.<Config>} config
 */

/**
 * Description
 *
 * @param {string} stdout stdout of generic webpack output
 * @returns {HashInfo} - an object containing hash-info
 * @throws Will throw an error if {@link stdout}
 * 		- is empty
 * 		- does not contain Hash
 *      - does not contain Hash
 * 		- if multiple configs then, count(hash) !== count(Child) + 1 (+1 is for global hash)
 *
 */
function extractHash(stdout: string): IHashInfo {
	if (stdout === "") {
		throw new Error("stdout is empty");
	}

	let hashArray: string[] = stdout.match(/Hash.*/gm);

	// If logs are full of errors and we don't find hash
	if (!hashArray) {
		throw new Error(
			`could not find hash in the stdout
			OUTPUT: ${stdout}`,
		);
	}

	hashArray = hashArray.map((hashLine: string) => hashLine.replace(/Hash:(.*)/, "$1").trim());

	const hashInfo: IHashInfo = {
		config: [],
		hash: hashArray[0],
	};

	// Multiple config were found
	if (hashArray.length > 1) {
		let childArray: string[] = stdout.match(/Child.*/gm);

		if (!childArray) {
			throw new Error(
				`could not find config in the stdout
				OUTPUT: ${stdout}`,
			);
		}

		childArray = childArray.map((childLine: string) => childLine.replace(/Child(.*):/, "$1").trim());

		// We don't need global hash anymore
		// so we'll remove it to maintain 1:1 parity between config and hash
		hashArray.shift();
		if (hashArray.length !== childArray.length) {
			throw new Error(`The stdout is corrupted. Hash count and config count do not match.
			OUTPUT: ${stdout}`);
		}
		const configCount = childArray.length;
		for (let configIdx = 0; configIdx < configCount; configIdx++) {
			hashInfo.config.push({
				hash: hashArray[configIdx],
				name: childArray[configIdx],
			});
		}
	}

	return hashInfo;
}

export { run, runWatch, extractHash };
