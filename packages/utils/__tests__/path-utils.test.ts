import { join } from "path";
import { isLocalPath, findProjectRoot } from "../path-utils";

describe("path-utils tests", () => {
	it("isLocalPath Testing : __dirname", () => {
		const answer = isLocalPath(join(__dirname, "../../"));
		expect(answer).toBe(true);
	});
	it("findProjectRoot testing", () => {
		const answer = findProjectRoot();
		expect(answer).toBe(process.cwd());
	});
	it("isLocalPath Testing : ../types", () => {
		const answer = isLocalPath(join(__dirname, "../types"));
		expect(answer).toBe(true);
	});
	it("isLocalPath Testing : ../notLocalPath", () => {
		const answer = isLocalPath("../notLocalPath");
		expect(answer).toBe(false);
	});
	it("isLocalPath Testing : ../notLocalPath using path.join", () => {
		const answer = isLocalPath(join(__dirname, "../notLocalPath"));
		expect(answer).toBe(false);
	});
	it("isLocalPath Testing : ./_snapshots (./path)", () => {
		const answer = isLocalPath(join(__dirname, "./__snapshots__"));
		expect(answer).toBe(true);
	});

	it("isLocalPath Testing : /_snapshots/ast-utils.test.ts.snap (path/path)", () => {
		const answer = isLocalPath(join(__dirname, "/__snapshots__/ast-utils.test.ts.snap"));
		expect(answer).toBe(true);
	});
	it("isLocalPath Testing : ..\\ win", () => {
		const answer = isLocalPath("..\\");
		expect(answer).toBe(true);
	});
});
