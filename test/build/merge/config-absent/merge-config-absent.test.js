"use strict";

const { run } = require("../../../utils/test-utils");

describe("merge flag configuration", () => {
  it("show warning message when the merge config is absent", async () => {
    // 2.js doesn't exist, let's try merging with it
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "--config",
      "./1.js",
      "--config",
      "./2.js",
      "--merge",
    ]);

    expect(exitCode).toBe(2);
    // Since the process will exit, nothing on stdout
    expect(stdout).toBeFalsy();
    // Confirm that the user is notified
    expect(stderr).toContain("Failed to load './2.js' config");
  });
});
