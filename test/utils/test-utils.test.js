"use strict";

const {
  run,
  runAndGetProcess,
  hyphenToUpperCase,
  uniqueDirectoryForTest,
} = require("./test-utils");

const ENTER = "\x0D";

describe("run function", () => {
  it("should work correctly by default", async () => {
    const { command, stdout, stderr } = await run(__dirname);

    expect(stderr).toBeFalsy();
    // Executes the correct command
    expect(command).toContain("cli.js");
    expect(command).toContain("bin");
    expect(stdout).toBeTruthy();
  });

  it("executes cli with passed commands and params", async () => {
    const { stdout, stderr, command } = await run(__dirname, ["info", "--output", "markdown"]);

    // execution command contains info command
    expect(command).toContain("info");
    expect(command).toContain("--output markdown");
    // Contains info command output
    expect(stdout).toContain("System:");
    expect(stdout).toContain("Node");
    expect(stdout).toContain("npm");
    expect(stdout).toContain("Yarn");
    expect(stderr).toBeFalsy();
  });

  it("uses default output when output param is false", async () => {
    const { stdout, stderr, command } = await run(__dirname, []);

    // execution command contains info command
    expect(command).not.toContain("--output-path");
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });
});

describe("runAndGetWatchProc function", () => {
  it("should work correctly by default", async () => {
    const { command, stdout, stderr } = await runAndGetProcess(__dirname);

    // Executes the correct command
    expect(command).toContain("cli.js");
    // Should use apply a default output dir
    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
  });

  it("executes cli with passed commands and params", async () => {
    const { stdout, stderr, command } = await runAndGetProcess(__dirname, [
      "info",
      "--output",
      "markdown",
    ]);

    // execution command contains info command
    expect(command).toContain("info");
    expect(command).toContain("--output markdown");
    // Contains info command output
    expect(stdout).toContain("System:");
    expect(stdout).toContain("Node");
    expect(stdout).toContain("npm");
    expect(stdout).toContain("Yarn");
    expect(stderr).toBeFalsy();
  });

  it("writes to stdin", async () => {
    const assetsPath = await uniqueDirectoryForTest();
    const { stdout } = await runAndGetProcess(assetsPath, ["init", "--force", "--template=mango"], {
      input: ENTER,
    });

    expect(stdout).toContain("Project has been initialised with webpack!");
  });
});

describe("hyphenToUpperCase function", () => {
  it("changes value from hyphen to upperCase", () => {
    const result = hyphenToUpperCase("test-value");

    expect(result).toEqual("testValue");
  });
});
