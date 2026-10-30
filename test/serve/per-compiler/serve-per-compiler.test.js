"use strict";

/* eslint-disable jest/require-top-level-describe -- Version-gated describe */

const path = require("node:path");
const [devServerVersion] = require("webpack-dev-server/package.json").version;
const { getFreePort, runWatch } = require("../../utils/test-utils");

/**
 * Starts `webpack serve` and requests every bundle from every dev server once they listen.
 * @param {string[]} args extra CLI arguments
 * @param {string=} config configuration file
 * @param {Record<string, string>=} env environment variables
 * @returns {Promise<{ exitCode: number, stdout: string, stderr: string, responses: Record<string, number> }>} result
 */
const serve = async (args, config = "webpack.config.js", env = {}) => {
  const appPort = await getFreePort();
  const adminPort = await getFreePort([appPort]);
  const names = config === "webpack.config.js" ? ["app", "admin"] : ["app"];
  const ports = { app: appPort, admin: adminPort };
  const responses = {};

  const result = await runWatch(
    __dirname,
    [
      "serve",
      "--config",
      config,
      "--watch-options-stdin",
      "--env",
      `appPort=${appPort}`,
      "--env",
      `adminPort=${adminPort}`,
      ...args,
    ],
    {
      env,
      handler: (proc) => {
        let output = "";
        let requesting = false;

        proc.stderr.on("data", (chunk) => {
          output += chunk.toString();

          if (requesting || !names.every((name) => output.includes(`Listening ${name}`))) {
            return;
          }

          requesting = true;

          Promise.all(
            names.flatMap((server) =>
              names.map((bundle) =>
                fetch(`http://127.0.0.1:${ports[server]}/${bundle}.js`).then((response) => {
                  responses[`${server}:${bundle}`] = response.status;
                }),
              ),
            ),
          ).finally(() => {
            proc.stdin.end();
          });
        });
      },
    },
  );

  return { ...result, responses };
};

const describeDevServer6 = devServerVersion === "5" ? describe.skip : describe;
const describeDevServer5 = devServerVersion === "5" ? describe : describe.skip;

describeDevServer6("serve with a dev server per compiler", () => {
  test("should serve all compilers by every dev server by default", async () => {
    const { exitCode, responses, stdout } = await serve([]);

    expect(exitCode).toBe(0);
    expect(responses).toEqual({
      "app:app": 200,
      "app:admin": 200,
      "admin:app": 200,
      "admin:admin": 200,
    });
    // Every dev server prints the stats of all compilers using its own options
    expect(stdout.match(/app\.js/g)).toHaveLength(1);
    expect(stdout.match(/admin\.js/g)).toHaveLength(1);
  });

  test("should serve all compilers by every dev server with webpack before 5.112", async () => {
    const { exitCode, responses } = await serve([], "webpack.config.js", {
      WEBPACK_PACKAGE: path.resolve(__dirname, "./old-webpack.js"),
    });

    expect(exitCode).toBe(0);
    expect(responses).toEqual({
      "app:app": 200,
      "app:admin": 200,
      "admin:app": 200,
      "admin:admin": 200,
    });
  });

  test("should serve each compiler only by its own dev server using the '--dev-server-per-compiler' option", async () => {
    const { exitCode, responses, stdout } = await serve(["--dev-server-per-compiler"]);

    expect(exitCode).toBe(0);
    expect(responses).toEqual({
      "app:app": 200,
      "app:admin": 404,
      "admin:app": 404,
      "admin:admin": 200,
    });
    // Each compiler is printed using the stats options of its own dev server
    expect(stdout).toContain("app.js");
    expect(stdout).not.toContain("admin.js");
  });

  test("should work with a single compiler using the '--dev-server-per-compiler' option", async () => {
    const { exitCode, responses } = await serve(["--dev-server-per-compiler"], "single.config.js");

    expect(exitCode).toBe(0);
    expect(responses).toEqual({ "app:app": 200 });
  });
});

describeDevServer5("serve with a dev server per compiler", () => {
  test("should warn and ignore the '--dev-server-per-compiler' option without plugin support", async () => {
    const { exitCode, stderr } = await serve(["--dev-server-per-compiler"]);

    expect(exitCode).toBe(0);
    expect(stderr).toContain(
      "The '--dev-server-per-compiler' option requires webpack-dev-server with plugin support",
    );
  });
});
