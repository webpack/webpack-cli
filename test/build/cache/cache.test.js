"use strict";

const fs = require("node:fs");
const path = require("node:path");
const url = require("node:url");
const { isWindows, processKill, run, runWatch } = require("../../utils/test-utils");

describe("cache", () => {
  it("should work", async () => {
    fs.rmSync(
      path.join(__dirname, "../../../node_modules/.cache/webpack/cache-test-default-development"),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.js"]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.js"]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work in multi compiler mode", async () => {
    fs.rmSync(
      path.join(
        __dirname,
        "../../../node_modules/.cache/webpack/cache-test-first-development__compiler1__",
      ),
      { recursive: true, force: true },
    );
    fs.rmSync(
      path.join(
        __dirname,
        "../../../node_modules/.cache/webpack/cache-test-second-development__compiler2__",
      ),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./multi.config.js"]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(2);
    expect(stderr.match(/Stored pack/g)).toHaveLength(2);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, ["-c", "./multi.config.js"]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(2);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(2);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(2);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work in multi compiler mode with the `--config-name` argument", async () => {
    fs.rmSync(
      path.join(
        __dirname,
        "../../../node_modules/.cache/webpack/cache-test-third-development__compiler1__",
      ),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./multi.config.js",
      "--config-name",
      "cache-test-first",
      "--name",
      "cache-test-third",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./multi.config.js",
      "--config-name",
      "cache-test-first",
      "--name",
      "cache-test-third",
    ]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work with the `--merge` argument", async () => {
    fs.rmSync(
      path.join(__dirname, "../../../node_modules/.cache/webpack/cache-test-fourth-development"),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./multi.config.js",
      "-c",
      "./webpack.config.js",
      "--merge",
      "--name",
      "cache-test-fourth",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./multi.config.js",
      "-c",
      "./webpack.config.js",
      "--merge",
      "--name",
      "cache-test-fourth",
    ]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work with the `--config-name` and `--merge` argument", async () => {
    fs.rmSync(
      path.join(__dirname, "../../../node_modules/.cache/webpack/cache-test-fifth-development"),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./multi.config.js",
      "-c",
      "./webpack.config.js",
      "--merge",
      "--config-name",
      "cache-test-first",
      "--config-name",
      "cache-test-second",
      "--name",
      "cache-test-fifth",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./multi.config.js",
      "-c",
      "./webpack.config.js",
      "--merge",
      "--config-name",
      "cache-test-first",
      "--config-name",
      "cache-test-second",
      "--name",
      "cache-test-fifth",
    ]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work with autoloading configuration", async () => {
    fs.rmSync(
      path.join(
        __dirname,
        "../../../node_modules/.cache/webpack/cache-test-autoloading-development",
      ),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, ["--name", "cache-test-autoloading"]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, ["--name", "cache-test-autoloading"]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work with relative path to configuration without build dependencies", async () => {
    fs.rmSync(
      path.join(
        __dirname,
        "../../../node_modules/.cache/webpack/no-build-dependencies-development",
      ),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./no-build-dependencies.config.js",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./no-build-dependencies.config.js",
    ]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work with file path to configuration without build dependencies", async () => {
    fs.rmSync(
      path.join(
        __dirname,
        "../../../node_modules/.cache/webpack/no-build-dependencies-file-development",
      ),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      path.resolve(__dirname, "./no-build-dependencies-file.config.js"),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      path.resolve(__dirname, "./no-build-dependencies-file.config.js"),
    ]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work with absolute path to configuration without build dependencies", async () => {
    fs.rmSync(
      path.join(
        __dirname,
        "../../../node_modules/.cache/webpack/no-build-dependencies-absolute-development",
      ),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      url
        .pathToFileURL(path.resolve(__dirname, "./no-build-dependencies-absolute.config.js"))
        .toString(),
    ]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      url
        .pathToFileURL(path.resolve(__dirname, "./no-build-dependencies-absolute.config.js"))
        .toString(),
    ]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  it("should work with multiple configuration and merge", async () => {
    fs.rmSync(
      path.join(__dirname, "../../../node_modules/.cache/webpack/base-override-development"),
      { recursive: true, force: true },
    );

    let { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./base.config.js",
      "-c",
      url.pathToFileURL(path.resolve(__dirname, "./base-override.config.js")).toString(),
      "--merge",
    ]);

    expect(exitCode).toBe(0);
    expect(stderr.match(/No pack exists at/g)).toHaveLength(1);
    expect(stderr.match(/Stored pack/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();

    ({ exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./base.config.js",
      "-c",
      url.pathToFileURL(path.resolve(__dirname, "./base-override.config.js")).toString(),
      "--merge",
    ]));

    expect(exitCode).toBe(0);
    expect(stderr.match(/restore cache container:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content metadata:/g)).toHaveLength(1);
    expect(stderr.match(/restore cache content \d+ \(.+\):/g)).toHaveLength(1);
    expect(stderr).toBeTruthy();
    expect(stdout).toBeTruthy();
  });

  if (!isWindows) {
    it("should graceful shutdown", async () => {
      fs.rmSync(
        path.join(
          __dirname,
          "../../../node_modules/.cache/webpack/cache-graceful-shutdown-development",
        ),
        {
          recursive: true,
          force: true,
        },
      );

      let stdout = "";

      await runWatch(__dirname, ["--config", "./graceful-exit.webpack.config.js", "--watch"], {
        handler: (proc) => {
          proc.stdout.on("data", (chunk) => {
            const data = chunk.toString();

            stdout += data;

            if (data.includes("app.bundle.js")) {
              processKill(proc);
            }
          });
        },
      });

      expect(stdout).toContain(
        "Gracefully shutting down. To force exit, press ^C again. Please wait...",
      );
    });
  }
});
