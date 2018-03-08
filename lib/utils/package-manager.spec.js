"use strict";

const path = require("path");

jest.mock("cross-spawn");
jest.mock("fs");

describe("package-manager", () => {
	const packageManager = require("./package-manager");
	const spawn = require("cross-spawn");
	const fs = require("fs");

	const defaultSyncResult = {
		pid: 1234,
		output: [null, null, null],
		stdout: null,
		stderr: null,
		signal: null,
		status: 1,
		error: null
	};

	function mockSpawnErrorOnce() {
		spawn.sync.mockReturnValueOnce(
			Object.assign({}, defaultSyncResult, {
				status: null,
				error: new Error()
			})
		);
	}

	function mockSpawnErrorTwice() {
		mockSpawnErrorOnce();
		mockSpawnErrorOnce();
	}

	spawn.sync.mockReturnValue(defaultSyncResult);

	it("should return 'yarn' from getPackageManager if it's installed", () => {
		expect(packageManager.getPackageManager()).toEqual("yarn");
	});

	it("should return 'npm' from getPackageManager if yarn is not installed", () => {
		mockSpawnErrorOnce();
		expect(packageManager.getPackageManager()).toEqual("npm");
	});

	it("should spawn yarn add from spawnChild", () => {
		const packageName = "some-pkg";

		packageManager.spawnChild(packageName);
		expect(spawn.sync).toHaveBeenLastCalledWith(
			"yarn",
			["global", "add", packageName],
			{ stdio: "inherit" }
		);
	});

	it("should spawn yarn upgrade from spawnChild", () => {
		const packageName = "some-pkg";

		fs.existsSync.mockReturnValueOnce(true);

		packageManager.spawnChild(packageName);
		expect(spawn.sync).toHaveBeenLastCalledWith(
			"yarn",
			["global", "upgrade", packageName],
			{ stdio: "inherit" }
		);
	});

	it("should spawn npm install from spawnChild", () => {
		const packageName = "some-pkg";

		mockSpawnErrorTwice();
		packageManager.spawnChild(packageName);
		expect(spawn.sync).toHaveBeenLastCalledWith(
			"npm",
			["install", "-g", packageName],
			{ stdio: "inherit" }
		);
	});

	it("should spawn npm update from spawnChild", () => {
		const packageName = "some-pkg";

		mockSpawnErrorTwice();
		fs.existsSync.mockReturnValueOnce(true);

		packageManager.spawnChild(packageName);
		expect(spawn.sync).toHaveBeenLastCalledWith(
			"npm",
			["update", "-g", packageName],
			{ stdio: "inherit" }
		);
	});

	it("should return the yarn global dir from getPathToGlobalPackages if yarn is installed", () => {
		const yarnDir = "/Users/test/.config/yarn/global";
		// Mock confirmation that yarn is installed
		spawn.sync.mockReturnValueOnce(defaultSyncResult);
		// Mock stdout of `yarn global dir`
		spawn.sync.mockReturnValueOnce({
			stdout: {
				toString: () => `${yarnDir}\n`
			}
		});
		const globalPath = packageManager.getPathToGlobalPackages();
		const expected = path.join(yarnDir, "node_modules");
		expect(globalPath).toBe(expected);
	});

	it("should return the npm global dir from getPathToGlobalPackages if yarn is not installed", () => {
		mockSpawnErrorOnce();
		const globalPath = packageManager.getPathToGlobalPackages();
		expect(globalPath).toBe(require("global-modules"));
	});
});
