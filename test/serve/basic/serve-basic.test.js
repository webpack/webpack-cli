"use strict";

const path = require("node:path");
const [devServerVersion] = require("webpack-dev-server/package.json").version;
const {
  getFreePort,
  normalizeStderr,
  normalizeStdout,
  runWatch,
} = require("../../utils/test-utils");

const testPath = path.resolve(__dirname);

const describeDevServer6 = devServerVersion === "5" ? describe.skip : describe;

const normalStdKillOptions = {
  stdoutKillStr: /webpack \d+\.\d+\.\d/,
  stderrKillStr: /Content not from webpack is served from/,
};

describe("basic serve usage", () => {
  let port;

  beforeEach(async () => {
    port = await getFreePort();
  });

  it("should work", async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve"], normalStdKillOptions);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--config" option', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "serve.config.js", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--config" and "--env" options', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "function-with-env.config.js", "--env", "foo=bar", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("WEBPACK_SERVE: true");
    expect(stdout).toContain("foo: 'bar'");
    expect(stdout).toContain("development");
  });

  it('should work with the "--config" and "--env" options and expose dev server options', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      [
        "serve",
        "--config",
        "function-with-argv.config.js",
        "--env",
        "foo=bar",
        "--hot",
        "--port",
        port,
      ],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("hot: true");
    expect(stdout).toContain("WEBPACK_SERVE: true");
    expect(stdout).toContain("foo: 'bar'");
    expect(stdout).toContain("development");
  });

  it("should work in multi compiler mode", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "multi.config.js", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("one");
    expect(stdout).toContain("first-output/main.js");
    expect(stdout).toContain("two");
    expect(stdout).toContain("second-output/main.js");
  });

  // TODO in the next major release, remove the condition, only dev servers with plugin support
  // select distinct ports for configurations without them
  describeDevServer6("with multiple dev servers", () => {
    it("should work in multi compiler mode without ports", async () => {
      const ports = [];
      const responses = {};
      const { exitCode, stdout } = await runWatch(
        __dirname,
        ["serve", "--config", "multi-dev-server.config.js", "--watch-options-stdin"],
        {
          // Automatic ports start from the base one
          env: { WEBPACK_DEV_SERVER_BASE_PORT: String(port) },
          handler: (proc) => {
            let output = "";

            proc.stderr.on("data", (chunk) => {
              output += chunk.toString();

              if (ports.length > 0) {
                return;
              }

              const found = [...output.matchAll(/Loopback: http:\/\/localhost:(\d+)\//g)].map(
                ([, found]) => found,
              );

              if (found.length < 2) {
                return;
              }

              ports.push(...found);

              // Every dev server serves all compilers
              Promise.all(
                ports.flatMap((port) =>
                  ["first-output", "second-output"].map((directory) =>
                    fetch(
                      `http://127.0.0.1:${port}/dev-server-my-public-path/${directory}/main.js`,
                    ).then((response) => {
                      responses[`${port}:${directory}`] = response.status;
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

      expect(exitCode).toBe(0);
      expect(new Set(ports).size).toBe(2);
      expect(Object.values(responses)).toEqual([200, 200, 200, 200]);
      expect(stdout).toContain("HotModuleReplacementPlugin");
      expect(stdout).toContain("first-output/main.js");
      expect(stdout).toContain("second-output/main.js");
    });
  });

  it('should work with the "--mode" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve"], normalStdKillOptions);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("development");
    expect(stdout).toContain("main.js");
  });

  it("should not start dev server when supplied false", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "dev-server-false.config.js"],
      normalStdKillOptions,
    );
    expect(stdout).toBeFalsy();
    expect(stderr).toContain("No dev server configurations to run");
  });

  it("should not start dev server when supplied false #1", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "dev-server-false.multi.config.js"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("app:");
    expect(stdout).toContain("worker:");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("compiled successfully");
  });

  it('should work with the "--stats" option', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--stats"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("compiled successfully");
  });

  it('should work with the "--stats verbose" option', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--stats", "verbose"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");

    const isMacOS = process.platform === "darwin";

    if (!isMacOS) {
      expect(stdout).toContain("from webpack.Compiler");
    }
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--mode" option #2', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--mode", "production"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("production");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--mode" option #3', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--mode", "development"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("compiled successfully");
    expect(stdout).toContain("development");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--progress" option', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--progress"],
      normalStdKillOptions,
    );

    expect(stderr).toContain("webpack.Progress");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stderr).toContain("webpack.Progress");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--progress" option using the "profile" value', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--progress", "profile"],
      normalStdKillOptions,
    );

    expect(stderr).toContain("webpack.Progress");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--client-log-level" option', async () => {
    const { stdout, stderr } = await runWatch(
      testPath,
      ["serve", "--client-logging", "info"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--port" option', async () => {
    const { stdout, stderr } = await runWatch(
      testPath,
      ["serve", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--hot" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve", "--hot"], normalStdKillOptions);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--no-hot" option', async () => {
    const { stdout, stderr } = await runWatch(
      testPath,
      ["serve", "--port", port, "--no-hot"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).not.toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--hot" option using the "only" value', async () => {
    const { stdout, stderr } = await runWatch(
      testPath,
      ["serve", "--port", port, "--hot=only"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with "--hot" and "--port" options', async () => {
    const { stdout, stderr } = await runWatch(
      testPath,
      ["serve", "--port", port, "--hot"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--hot" and "--progress" options', async () => {
    const { stdout, stderr } = await runWatch(
      testPath,
      ["serve", "--port", port, "--hot", "--progress"],
      normalStdKillOptions,
    );

    expect(stderr).toContain("webpack.Progress");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the default "publicPath" option', async () => {
    const { stderr, stdout } = await runWatch(__dirname, ["serve"], normalStdKillOptions);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--output-public-path" option', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--output-public-path", "/my-public-path/", "--stats", "verbose"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("/my-public-path/");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should respect the "publicPath" option from configuration', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "output-public-path.config.js"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
    expect(stdout).toContain("/my-public-path/");
  });

  it('should respect the "publicPath" option from configuration using multi compiler mode', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "multi-output-public-path.config.js", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("one");
    expect(stdout).toContain("first-output/main.js");
    expect(stdout).toContain("two");
    expect(stdout).toContain("second-output/main.js");
    expect(stdout).toContain("/my-public-path/");
  });

  it('should respect the "publicPath" option from configuration (from the "devServer" options)', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "dev-server-output-public-path.config.js"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should work with the "--open" option', async () => {
    const { stdout, stderr } = await runWatch(
      testPath,
      ["serve", "--open", "--port", port],
      normalStdKillOptions,
    );

    let normalizedStderr = normalizeStderr(stderr);

    if (/wait until bundle finished/.test(normalizedStderr)) {
      normalizedStderr = normalizedStderr.split("\n");

      const waitIndex = normalizedStderr.findIndex((item) =>
        /wait until bundle finished/.test(item),
      );

      if (waitIndex !== -1) {
        normalizedStderr.splice(waitIndex, 1);
      }

      normalizedStderr = normalizedStderr.join("\n");
    }

    expect(normalizedStderr).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it('should respect the "publicPath" option from configuration using multi compiler mode (from the "devServer" options)', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "multi-dev-server-output-public-path.config.js", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("one");
    expect(stdout).toContain("first-output/main.js");
    expect(stdout).toContain("two");
    expect(stdout).toContain("second-output/main.js");
  });

  it("should work with entries syntax", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "./src/entry.js", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("development");
  });

  it("should work and log warning on the 'watch' option in a configuration", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "./watch.config.js", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("development");
  });

  it("should log error on using '--watch' flag with serve", async () => {
    const { stdout, stderr } = await runWatch(
      __dirname,
      ["serve", "--watch", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it("should log warning on using '-w' alias with serve", async () => {
    const { stdout, stderr } = await runWatch(
      __dirname,
      ["serve", "-w", "--port", port],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("HotModuleReplacementPlugin");
    expect(stdout).toContain("main.js");
  });

  it("should log an error on unknown flag", async () => {
    const { exitCode, stdout, stderr } = await runWatch(testPath, [
      "serve",
      "--port",
      port,
      "--unknown-flag",
    ]);

    expect(exitCode).toBe(2);
    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });

  it('should work with the "stats" option in config', async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "stats.config.js"],
      normalStdKillOptions,
    );

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    expect(stdout).toContain("compiled successfully");
    expect(stdout.match(/HotModuleReplacementPlugin/g)).toBeNull();
  });

  it("should log used supplied config with serve", async () => {
    const { stderr, stdout } = await runWatch(
      __dirname,
      ["serve", "--config", "log.config.js", "--port", port],
      {
        killString: /Compiler is watching files for updates\.\.\./,
      },
    );

    // Check the raw output: the "serving events at ..." log of webpack-dev-middleware confuses
    // the stack trace normalization, which then removes the line with the config path
    expect(stderr).toContain("log.config.js");
    expect(normalizeStdout(stdout)).toContain("compiled successfully");
  });

  it("should throw error when same ports in multicompiler", async () => {
    const { stderr } = await runWatch(__dirname, [
      "serve",
      "--config",
      "same-ports-dev-server.config.js",
    ]);

    expect(normalizeStderr(stderr)).toMatchSnapshot("stderr");
    // Due to racing logic, first dev server can be started and compiled, but then the second always fails
    // expect(normalizeStdout(stdout)).toMatchSnapshot("stdout");
  });
});
