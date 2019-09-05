"use strict";

const validation = require("../../../../bin/utils/validate-options");
const { run } = require("../../../testUtils");

test("validation", () => {
	const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});
	validation(null);
	expect(mockExit).toHaveBeenCalledWith(-1);
	mockExit.mockRestore();
});

test("validation-success", () => {
	const { stdout, code } = run(__dirname, ["--config", "./options.js"]);
	expect(stdout).toContain("Can't resolve 'hey'");
	expect(code).toBe(2);
});
