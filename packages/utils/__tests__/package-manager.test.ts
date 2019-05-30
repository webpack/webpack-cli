"use strict";

import * as path from "path";
import * as packageManager from "../package-manager";

jest.mock("cross-spawn");
jest.mock("fs");

describe("package-manager", () => {
	// eslint-disable-next-line
	const spawn = require("cross-spawn");
	// eslint-disable-next-line
	const fs = require("fs");

	const defaultSyncResult = {
		error: null,
		output: [null, null, null],
		pid: 1234,
		signal: null,
		status: 1,
		stderr: null,
		stdout: null
	};

	function mockSpawnErrorOnce() {
		spawn.sync.mockReturnValueOnce(
			Object.assign({}, defaultSyncResult, {
				error: new Error(),
				status: null
			})
		);
	}

	function mockSpawnErrorTwice() {
		mockSpawnErrorOnce();
		mockSpawnErrorOnce();
	}

	function mockUpdateYarnOnce() {
		fs.existsSync.mockReturnValueOnce(false);
		fs.existsSync.mockReturnValueOnce(true);
		fs.existsSync.mockReturnValueOnce(false);
		fs.existsSync.mockReturnValueOnce(true);
		fs.existsSync.mockReturnValueOnce(true);
	}

	function mockUpdateNPMOnce() {
		fs.existsSync.mockReturnValueOnce(true);
		fs.existsSync.mockReturnValueOnce(false);
		fs.existsSync.mockReturnValueOnce(true);
		fs.existsSync.mockReturnValueOnce(true);
		fs.existsSync.mockReturnValueOnce(true);
	}

	jest.spyOn(spawn, "sync").mockReturnValue(defaultSyncResult);

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
		expect(spawn.sync).toHaveBeenLastCalledWith("yarn", ["global", "add", packageName], { stdio: "inherit" });
	});

	it("should spawn yarn upgrade from spawnChild", () => {
		const packageName = "some-pkg";

		mockUpdateYarnOnce();

		packageManager.spawnChild(packageName);
		expect(spawn.sync).toHaveBeenLastCalledWith("yarn", ["global", "upgrade", packageName], { stdio: "inherit" });
	});

	it("should spawn npm install from spawnChild", () => {
		const packageName = "some-pkg";

		mockSpawnErrorTwice();
		packageManager.spawnChild(packageName);
		expect(spawn.sync).toHaveBeenLastCalledWith("npm", ["install", "-g", packageName], { stdio: "inherit" });
	});

	it("should spawn npm update from spawnChild", () => {
		const packageName = "some-pkg";

		mockUpdateNPMOnce();

		packageManager.spawnChild(packageName);
		expect(spawn.sync).toHaveBeenLastCalledWith("npm", ["update", "-g", packageName], { stdio: "inherit" });
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
