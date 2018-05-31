/* globals describe it beforeEach */
"use strict";

const path = require("path");
const fs = require("fs");
const child_process = require("child_process");

function spawn(args, options) {
	return child_process.spawn(
		process.execPath,
		[
			require.resolve("nyc/bin/nyc.js"),
			"--reporter",
			"none",
			"--no-all",
			process.execPath,
			"--no-deprecation",
			require.resolve("./helpers/exec-in-directory.js"),
			options.cwd
		].concat(args),
		Object.assign({}, options, {
			cwd: undefined
		})
	);
}

function loadOptsFile(optsPath) {
	// Options file parser from Mocha
	// https://github.com/mochajs/mocha/blob/2bb2b9fa35818db7a02e5068364b0c417436b1af/bin/options.js#L25-L31
	return fs
		.readFileSync(optsPath, "utf8")
		.replace(/\\\s/g, "%20")
		.split(/\s/)
		.filter(Boolean)
		.map(value => value.replace(/%20/g, " "));
}

function getTestSpecificArguments(testDirectory) {
	try {
		return loadOptsFile(path.join(testDirectory, "test.opts"));
	} catch (e) {
		return null;
	}
}

function convertToArrayOfLines(outputArray) {
	if (outputArray.length === 0) return outputArray;
	return outputArray.join("").split("\n");
}

function findTestsRecursive(readPath) {
	const entries = fs.readdirSync(readPath);
	const isAnyTests = entries.indexOf("stdin.js") !== -1;

	const folders = entries
		.map(entry => path.join(readPath, entry))
		.filter(entry => fs.statSync(entry).isDirectory());

	const result = isAnyTests ? [readPath] : [];

	return result.concat(
		folders.map(findTestsRecursive).reduce((acc, list) => acc.concat(list), [])
	);
}

const casesPath = path.join(__dirname, "binCases");
const defaultArgs = loadOptsFile(path.join(casesPath, "test.opts"));

describe("BinTestCases", function() {
	const tests = findTestsRecursive(casesPath);

	tests.forEach(testDirectory => {
		const testName = testDirectory.replace(casesPath, "");
		const testArgs = getTestSpecificArguments(testDirectory) || defaultArgs;
		const testAssertions = require(path.join(testDirectory, "stdin.js"));
		const outputPath = path.join(
			path.resolve(casesPath, "../js/bin"),
			testName
		);

		const cmd = `${path.resolve(__dirname, "../cli.js")}`;
		const args = testArgs.concat(["--output-path", `${outputPath}`]);
		const opts = {
			cwd: testDirectory
		};

		const asyncExists = fs.existsSync(path.join(testDirectory, "async"));

		const env = {
			stdout: [],
			stderr: [],
			error: []
		};

		if (asyncExists) {
			describe(testName, function() {
				it("should run successfully", function(done) {
					jest.setTimeout(20000);
					const child = spawn([cmd].concat(args), opts);

					child.on("close", code => {
						env.code = code;
					});

					child.on("error", error => {
						env.error.push(error);
					});

					child.stdout.on("data", data => {
						env.stdout.push(data);
					});

					child.stderr.on("data", data => {
						env.stderr.push(data);
					});

					setTimeout(() => {
						if (env.code) {
							done(`Watch didn't run ${env.error}`);
						}

						const stdout = convertToArrayOfLines(env.stdout);
						const stderr = convertToArrayOfLines(env.stderr);
						try {
							testAssertions(stdout, stderr, done);
						} catch(e) {
							console.log(`### stderr ###\n${env.stderr.join("")}`);
							console.log(`### stdout ###\n${env.stdout.join("")}`);
							throw e;
						}
						child.kill();
					}, 8000); // wait a little to get an output
				});
			});
		} else {
			describe(testName, function() {
				beforeAll(function(done) {
					jest.setTimeout(30000);

					const child = spawn([cmd].concat(args), opts);

					child.on("close", code => {
						env.code = code;
						done();
					});

					child.on("error", error => {
						env.error.push(error);
					});

					child.stdout.on("data", data => {
						env.stdout.push(data);
					});

					child.stderr.on("data", data => {
						env.stderr.push(data);
					});
				});

				it("should not cause any errors", function() {
					expect(env.error).toHaveLength(0);
				});

				it("should run successfully", function() {
					const stdout = convertToArrayOfLines(env.stdout);
					const stderr = convertToArrayOfLines(env.stderr);
					try {
						testAssertions(env.code, stdout, stderr);
					} catch(e) {
					//	console.log(`### stderr ###\n${env.stderr.join("")}`);
					//	console.log(`### stdout ###\n${env.stdout.join("")}`);
						throw e;
					}
				});
			});
		}
	});
});
