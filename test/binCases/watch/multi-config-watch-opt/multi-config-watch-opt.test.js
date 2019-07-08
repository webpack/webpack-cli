"use strict";

jest.setTimeout(10e6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */
const fs = require("fs");
const path = require("path");
const {
	extractSummary,
	extractHash,
	appendDataIfFileExists,
	runAndGetWatchProc,
	copyFile
} = require("../../../testUtils");

const fileToChange = "index.js";
const fileToChangePath = path.resolve(__dirname, fileToChange);
var copyFilePath;

// create copy of "index.js" => "index_copy.js"
beforeEach(() => {
	copyFilePath = copyFile(__dirname, fileToChange);
});

afterEach(() => {
	try {
		// subsequent test-case runs won't pass as snapshot is not matched
		// hence, deleting the file as it is modified by the test
		fs.unlinkSync(fileToChangePath);
	} catch (e) {
		console.warn("could not remove the file:" + fileToChangePath + "\n" + e.message);
	} finally {
		fs.renameSync(copyFilePath, fileToChangePath);
	}
});

test.skip("multi-config-watch-opt", done => {
	const webpackProc = runAndGetWatchProc(__dirname, [
		"--entry",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--watch"
	]);

	// info-verbosity is set to info by default
	// It does not spit the output in one go.
	// So we need to keep a track of chunks output order
	// 1. webpack is watching the files...
	// 2. Hash and other info
	// 3. (file changed) Hash and other info
	var chunkNumber = 0;
	var hash1, hash2;

	webpackProc.stdout.on("data", data => {
		data = data.toString();
		chunkNumber++;

		switch (chunkNumber) {
			case 1:
				expect(extractSummary(data)).toMatchSnapshot();

				hash1 = extractHash(data);

				// We get webpack output after running test
				// Since we are running the webpack in watch mode, changing file will generate additional output
				// First time output will be validated fully
				// Hash of the The subsequent output will be tested against that of first time output
				appendDataIfFileExists(__dirname, fileToChange, "//junk-comment");

				break;
			case 2:
				hash2 = extractHash(data);

				expect(hash2.hash).not.toBe(hash1.hash);

				webpackProc.kill();
				done();
				break;
			default:
				break;
		}
	});

	webpackProc.stderr.on("data", error => {
		expect(error.toString()).toContain("webpack is watching the files");
	});
});
