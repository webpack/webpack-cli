"use strict";

jest.setTimeout(10e6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const { extractSummary, extractHash, appendDataIfFileExists, runAndGetWatchProc } = require("../../../testUtils");
const fs = require("fs");
const path = require("path");

const fileToChange = "index.js";
const copyFile = "index_copy.js";
const fileToChangePath = path.resolve(__dirname, fileToChange);
const copyFilePath = path.resolve(__dirname, copyFile);

// create copy of "index.js" => "index_copy.js"
beforeEach(() => {
	// fs.copyFileSync was added in Added in: v8.5.0
	// We should migrate it once we stop support for v6.x
	fs.createReadStream(fileToChangePath).pipe(fs.createWriteStream(copyFilePath));
});

afterEach(() => {
	try {
		// deleting the file as it is modified by the test
		// subsequent test-case runs won't pass as snapshot is not matched
		fs.unlinkSync(fileToChangePath);
	} catch (e) {
		console.warn("could not remove the file:" + fileToChangePath + "\n" + e.message);
	} finally {
		fs.renameSync(copyFilePath, fileToChangePath);
	}
});

// It is modifying the index.js
// Which breaks the test-cases second time
test.only("info-verbosity-off", async done => {
	var webpackProc = runAndGetWatchProc(__dirname, [
		"--entry ",
		"./index.js",
		"--config",
		"./webpack.config.js",
		"--output-filename",
		"[name].js",
		"--output-chunk-filename",
		"[id].chunk.js",
		"--target",
		"async-node",
		"--watch",
		"--info-verbosity",
		"none"
	]);

	var outputCount = 0;
	var hash1;

	webpackProc.stdout.on("data", data => {
		data = data.toString();

		if (outputCount === 0) {
			hash1 = extractHash(data);

			const summary = extractSummary(data);

			expect(summary).toEqual(expect.anything());
			expect(summary).toContain("");
			expect(summary).not.toContain("webpack is watching the files…");
			expect(summary).toMatchSnapshot();

			// change file
			appendDataIfFileExists(__dirname, fileToChange, "//junk-comment");

			outputCount++;
		} else {
			const hash2 = extractHash(data);

			expect(hash2.hash).not.toBe(hash1.hash);
			webpackProc.kill();
			done();
		}
	});

	webpackProc.stderr.on("data", error => {
		// fail test case if there is any error
		expect(true).toBe(false);
		done();
	});
});
