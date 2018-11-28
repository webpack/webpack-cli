import * as shell from "shelljs";
import { storeBase } from "../utils/baseHandler";

describe("baseHandler", () => {
	describe("storeBase", () => {
		storeBase(process.cwd() + "../testProject");
		it("should store all js files", () => {
			expect(shell.test("-e", "../utils/base/index.js")).toBe(true);
			expect(shell.test("-e", "../utils/base/webpack.config.js")).toBe(true);
			expect(shell.test("-e", "../utils/base/utils/foo.js")).toBe(true);
			expect(shell.test("-e", "../utils/base/utils/bar.js")).toBe(true);
		});
		it("should not store non JS/TS files", () => {
			expect(shell.test("-e", "../utils/base/utils/logo.png")).toBe(false);
			expect(shell.test("-e", "../utils/base/favicon.io")).toBe(false);
		});
	});
});
