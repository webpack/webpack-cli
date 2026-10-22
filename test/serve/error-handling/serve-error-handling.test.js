"use strict";

/* eslint-disable jest/require-top-level-describe -- Version-gated describe */

const [devServerVersion] = require("webpack-dev-server/package.json").version;
const { run, runWatch } = require("../../utils/test-utils");

const getGetPort = () => import("get-port");

// Only plugin mode uses the CLI's watch callback.
const describeDevServer6 = devServerVersion === "5" ? describe.skip : describe;

describeDevServer6("serve error handling", () => {
  let port;

  beforeEach(async () => {
    port = await (await getGetPort()).default();
  });

  test("should print the stats with errors and keep serving when the compilation fails", async () => {
    const { exitCode, stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "error.config.js", "--port", port],
      {
        stdoutKillStr: /ERROR/,
        stderrKillStr: /Project is running at:/,
      },
    );

    expect(stdout).toContain("ERROR in");
    expect(stderr).toContain("Project is running at:");
    expect(exitCode).toBe(1);
  });

  test("should print the stats with warnings using the '--fail-on-warnings' option", async () => {
    const { exitCode, stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "warning.config.js", "--fail-on-warnings", "--port", port],
      {
        stdoutKillStr: /WARNING/,
        stderrKillStr: /Project is running at:/,
      },
    );

    expect(stdout).toContain("WARNING");
    expect(stderr).toContain("Project is running at:");
    expect(exitCode).toBe(1);
  });

  test.each(process.platform === "win32" ? ["stdin"] : ["SIGINT", "SIGTERM", "stdin"])(
    "should preserve failure status and close the compiler on %s",
    async (trigger) => {
      const { exitCode, stdout, stderr } = await runWatch(
        __dirname,
        [
          "serve",
          "--config",
          "shutdown.config.js",
          "--fail-on-warnings",
          "--watch-options-stdin",
          "--port",
          port,
        ],
        {
          handler: (proc) => {
            let output = "";
            let serverOutput = "";
            let stopping = false;
            const stop = () => {
              if (
                stopping ||
                !output.includes("WARNING") ||
                !serverOutput.includes("Server ready")
              ) {
                return;
              }

              stopping = true;

              if (trigger === "stdin") {
                proc.stdin.end();
              } else {
                proc.kill(trigger);
              }
            };

            proc.stdout.on("data", (chunk) => {
              output += chunk.toString();
              stop();
            });
            proc.stderr.on("data", (chunk) => {
              serverOutput += chunk.toString();
              stop();
            });
          },
        },
      );

      expect(exitCode).toBe(1);
      expect(stderr).toContain("Server ready: 1 SIGINT, 1 SIGTERM");
      expect(stdout.match(/Compiler shutdown/g)).toHaveLength(1);
    },
  );

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
