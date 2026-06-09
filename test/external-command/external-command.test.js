const { run } = require("../utils/test-utils");

describe("external command", () => {
  it("should work", async () => {
    const { exitCode, stdout, stderr } = await run(__dirname, ["custom-command"], {
      nodeOptions: ["--import=./register-loader.mjs"],
    });

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("custom unknown");
  });

  it("should work with options", async () => {
    const { exitCode, stdout, stderr } = await run(__dirname, ["custom-command", "--output=json"], {
      nodeOptions: ["--import=./register-loader.mjs"],
    });

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("custom json");
  });

  it("should work with help", async () => {
    const { exitCode, stdout, stderr } = await run(__dirname, ["help", "custom-command"], {
      nodeOptions: ["--import=./register-loader.mjs"],
    });

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("Usage");
    expect(stdout).toContain("webpack custom-command|cc [options]");
    expect(stdout).toContain("-o, --output <value>");
    expect(stdout).toContain("To get the output in a specified format");
  });

  it("should work with help for option", async () => {
    const { exitCode, stdout, stderr } = await run(
      __dirname,
      ["help", "custom-command", "--output"],
      {
        nodeOptions: ["--import=./register-loader.mjs"],
      },
    );

    expect(exitCode).toBe(0);
    expect(stderr).toBeFalsy();
    expect(stdout).toContain("Usage");
    expect(stdout).toContain("webpack custom-command --output <value>");
    expect(stdout).toContain("Description");
    expect(stdout).toContain("To get the output in a specified format");
  });

  it("should handle errors in external commands", async () => {
    const { exitCode, stdout, stderr } = await run(__dirname, ["errored-custom-command"], {
      nodeOptions: ["--import=./register-loader.mjs"],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Unable to load 'errored-custom-command' command");
    expect(stderr).toContain("Error: error in apply");
    expect(stdout).toBeFalsy();
  });

  it("should handle errors in external commands when loading", async () => {
    const { exitCode, stdout, stderr } = await run(__dirname, ["errored-loading-custom-command"], {
      nodeOptions: ["--import=./register-loader.mjs"],
    });

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Unable to load 'errored-loading-custom-command' command");
    expect(stderr).toContain("Error: error in loading");
    expect(stdout).toBeFalsy();
  });
});
