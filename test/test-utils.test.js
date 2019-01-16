"use strict";

const { extractHash, appendDataIfFileExists, copyFile } = require("./testUtils");
const { writeFileSync, unlinkSync, readFileSync, existsSync } = require("fs");
const { resolve } = require("path");

describe("extractHash functionality", () => {
	it("should throw Error if there is empty string", () => {
		const stdout = "";

		expect(() => extractHash(stdout)).toThrowError();
	});

	it("should throw Error if there is no hash value", () => {
		const stdout = `Entrypoint main = main.js
        [./src/index.js] 2.52 KiB {main} [built] [failed] [1 error]
        ERROR in ./src/index.js
        Module build failed (from ./node_modules/babel-loader/lib/index.js):
        TypeError: Cannot read property 'bindings' of null`;

		expect(() => extractHash(stdout)).toThrowError();
	});

	it("should throw Error if hash count and config count do not match", () => {
		const stdout = `Hash: c6fe1f550a76720b1eaec6fe1f550a76720b1eae
        Version: webpack 4.25.0
        Child index1:
            Hash: c6fe1f550a76720b1eae
            Time: 146ms
            Built at: 11/05/2018 7:58:13 PM
              Asset       Size  Chunks             Chunk Names
            main.js  956 bytes       0  [emitted]  main
            Entrypoint main = main.js
            [0] ./src/index.1.js 48 bytes {0} [built]
        
            WARNING in configuration
            The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
            You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
        Child index2:`;

		expect(() => extractHash(stdout)).toThrowError();
	});

	it("should fetch hash if there is only single config", () => {
		const actualGlobalHash = "c961f4babc1cda156fa0";

		const stdout = `Hash: ${actualGlobalHash}
        Version: webpack 4.25.0
        Time: 865ms
        Built at: 11/05/2018 6:30:19 PM
          Asset      Size  Chunks             Chunk Names
        main.js  6.31 KiB    main  [emitted]  main
        Entrypoint main = main.js
        [./src/index.js] 2.52 KiB {main} [built] [failed] [1 error]
        ERROR in ./src/index.js
        Module build failed (from ./node_modules/babel-loader/lib/index.js):
        TypeError: Cannot read property 'bindings' of null`;

		const hashInfo = extractHash(stdout);

		expect(hashInfo).not.toBeNull();
		expect(hashInfo.hash).toBe(actualGlobalHash);
		expect(hashInfo.config).toHaveLength(0);
	});

	it("should fetch hash if there is more than one config", () => {
		const actualGlobalHash = "c6fe1f550a76720b1eaec6fe1f550a76720b2aed";
		const config1Hash = "c6fe1f550a76720b1eae";
		const config1Name = "index1";

		const config2Hash = "c6fe1f550a76720b2aed";
		const config2Name = "index2";

		const stdout = `Hash: ${actualGlobalHash}
Version: webpack 4.25.0
Child ${config1Name}:
    Hash: ${config1Hash}
    Time: 146ms
    Built at: 11/05/2018 7:58:13 PM
      Asset       Size  Chunks             Chunk Names
    main.js  956 bytes       0  [emitted]  main
    Entrypoint main = main.js
    [0] ./src/index.1.js 48 bytes {0} [built]

    WARNING in configuration
    The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
    You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/
Child ${config2Name}:
    Hash: ${config2Hash}
    Time: 123ms
    Built at: 11/05/2018 7:58:13 PM
      Asset       Size  Chunks             Chunk Names
    main.js  956 bytes       0  [emitted]  main
    Entrypoint main = main.js
    [0] ./src/index.2.js 48 bytes {0} [built]`;

		const hashInfo = extractHash(stdout);

		expect(hashInfo).not.toBeNull();
		expect(hashInfo.hash).toBe(actualGlobalHash);
		expect(hashInfo.config).toHaveLength(2);
		expect(hashInfo.config[0]).toEqual({ name: config1Name, hash: config1Hash });
		expect(hashInfo.config[1]).toEqual({ name: config2Name, hash: config2Hash });
	});
});

describe("appendFile functionality", () => {
	describe("positive test-cases", () => {
		const junkFile = "junkFile.js";
		const junkFilePath = resolve(__dirname, junkFile);
		const initialJunkData = "initial junk data";
		const junkComment = "//junk comment";

		beforeEach(() => {
			writeFileSync(junkFilePath, initialJunkData);
		});
		afterEach(() => {
			unlinkSync(junkFilePath);
		});
		it("should append data to file if file exists", () => {
			appendDataIfFileExists(__dirname, junkFile, junkComment);
			const actualData = readFileSync(junkFilePath).toString();

			expect(actualData).toBe(initialJunkData + junkComment);
		});
	});

	describe("negative test-cases", () => {
		it("should throw error if file does not exist", () => {
			expect(() => appendDataIfFileExists(__dirname, "does-not-exist.js", "junk data")).toThrowError();
		});
	});
});

describe("copyFile functionality", () => {
	describe("positive test-cases", () => {
		const originalFile = "junkFile.js";
		const originalFilePath = resolve(__dirname, originalFile);
		const originalFileData = "initial junk data";
		var copyFilePath;

		beforeEach(() => {
			writeFileSync(originalFilePath, originalFileData);
		});
		afterEach(() => {
			unlinkSync(originalFilePath);
			if (existsSync(copyFilePath)) {
				unlinkSync(copyFilePath);
			}
		});
		it("should copy file if file exists", () => {
			copyFilePath = copyFile(__dirname, originalFile);
			const actualData = readFileSync(copyFilePath).toString();

			expect(actualData).toBe(originalFileData);
		});
	});

	describe("negative test-cases", () => {
		it("should throw error if file does not exist", () => {
			expect(() => copyFile(__dirname, "does-not-exist.js")).toThrowError();
		});
	});
});
