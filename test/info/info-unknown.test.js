const { run } = require("../utils/test-utils");

describe("should handle unknown args", () => {
  it("shows an appropriate warning on supplying unknown args", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["info", "--unknown"]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Error: Unknown option '--unknown'");
    expect(stdout).toBeFalsy();
  });
});
