"use strict";

/* eslint-disable jest/require-top-level-describe -- `describeDevServer6` is a version-gated `describe` the plugin cannot resolve */

const [devServerVersion] = require("webpack-dev-server/package.json").version;
const { run, runWatch } = require("../../utils/test-utils");

const getGetPort = () => import("get-port");

// The CLI only owns the watch callback (stats printing and error handling)
// when the dev server runs as a compiler plugin (webpack-dev-server 6+).
const describeDevServer6 = devServerVersion === "5" ? describe.skip : describe;

describeDevServer6("serve error handling", () => {
  let port;

  beforeEach(async () => {
    port = await (await getGetPort()).default();
  });

  test("should print the stats with errors and keep serving when the compilation fails", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "error.config.js", "--port", port],
      {
        stdoutKillStr: /ERROR/,
        stderrKillStr: /Project is running at:/,
      },
    );

    expect(stdout).toContain("ERROR in");
    expect(stderr).toContain("Project is running at:");
  });

  test("should print the stats with warnings using the '--fail-on-warnings' option", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "warning.config.js", "--fail-on-warnings", "--port", port],
      {
        stdoutKillStr: /WARNING/,
        stderrKillStr: /Project is running at:/,
      },
    );

    expect(stdout).toContain("WARNING");
    expect(stderr).toContain("Project is running at:");
  });

  test("should log the error and exit when the dev server fails inside the watch run", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "serve",
      "--config",
      "setup-failure.config.js",
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain("Injected middleware failure");
    expect(stdout).toBeFalsy();
  });

  test("should log the validation error and exit when a middleware option is invalid", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "serve",
      "--config",
      "bad-middleware.config.js",
    ]);

    expect(exitCode).toBe(2);
    expect(stderr).toContain(
      "Dev Middleware has been initialized using an options object that does not match the API schema",
    );
    expect(stderr).not.toContain("at Server.setupMiddlewares");
    expect(stdout).toBeFalsy();
  });
});
