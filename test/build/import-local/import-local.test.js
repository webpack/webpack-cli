"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { cleanStderr, run } = require("../../utils/test-utils");

describe("import local", () => {
  let directory;

  beforeAll(() => {
    // A project with its own installation of `webpack-cli`
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "webpack-cli-import-local-"));

    const bin = path.join(directory, "node_modules", "webpack-cli", "bin");

    fs.mkdirSync(bin, { recursive: true });
    fs.writeFileSync(
      path.join(directory, "node_modules", "webpack-cli", "package.json"),
      JSON.stringify({ name: "webpack-cli", main: "bin/cli.js" }),
    );
    fs.writeFileSync(path.join(bin, "cli.js"), 'console.log("local webpack-cli");\n');
  });

  afterAll(() => {
    fs.rmSync(directory, { recursive: true, force: true });
  });

  it("should run the local installation", async () => {
    const { exitCode, stderr, stdout } = await run(directory, ["--version"]);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout.trim()).toBe("local webpack-cli");
  });

  it("should skip the local installation when supplied", async () => {
    const { exitCode, stdout } = await run(directory, ["--version"], {
      env: { WEBPACK_CLI_SKIP_IMPORT_LOCAL: true },
    });

    expect(exitCode).toBe(0);
    expect(stdout).toBeTruthy();
    expect(stdout).not.toContain("local webpack-cli");
  });

  it("should build without a local installation", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, []);

    expect(exitCode).toBe(0);
    expect(cleanStderr(stderr)).toBeFalsy();
    expect(stdout).toBeTruthy();
  });
});
