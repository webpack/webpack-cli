"use strict";

jest.setTimeout(10E6);
/* eslint-disable node/no-unsupported-features  */
/* eslint-disable node/no-unsupported-features/es-syntax  */

const fs = require("fs");
const path = require("path");
const { extractSummary, extractHash, appendDataIfFileExists, runAndGetWatchProc } = require("../../../testUtils");

const fileToChange = "index.js";
const copyFile = "index_copy.js";
const fileToChangePath = path.resolve(__dirname, fileToChange);
const copyFilePath = path.resolve(__dirname, copyFile);

// create copy of "index.js" => "index_copy.js"
beforeEach(() => {
	// fs.copyFileSync was added in Added in: v8.5.0
	// We should refactor the below code once our minimal supported version is v8.5.0
	fs.createReadStream(fileToChangePath).pipe(fs.createWriteStream(copyFilePath));
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

test("info-verbosity-verbose", async done => {
	const webpackProc = runAndGetWatchProc(__dirname, [
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
		"verbose"
	]);

	// Watch mode with --info-verbosity verbose does not spit the output in one go.
	// So we need to keep a track of chunks output order
	// 1. Compilation starting...
	// 2. webpack is watching the files...
	// 3. Compilation  finished
	// 4. Hash and other info
	// 5. Compilation starting...
	// 6. Compilation  finished
	// 7. Hash and other info
	var chunkNumber = 0;
	var hash1, hash2;

	webpackProc.stdout.on("data", data => {
		data = data.toString();
		chunkNumber++;

		switch (chunkNumber) {
			case 1:
			case 5:
				expect(data).toContain("Compilation  starting");
				break;
			case 2:
				expect(data).toContain("webpack is watching the files");
				break;
			case 3:
			case 6:
				expect(data).toContain("Compilation  finished");
				break;
			case 4:
				expect(extractSummary(data)).toMatchSnapshot();

				hash1 = extractHash(data);

				// We get webpack output after running test
				// Since we are running the webpack in watch mode, changing file will generate additional output
				// First time output will be validated fully
				// Hash of the The subsequent output will be tested against that of first time output
				appendDataIfFileExists(__dirname, fileToChange, "//junk-comment");

				break;
			case 7:
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
		// fail test case if there is any error
		done(error.toString());
	});
});
