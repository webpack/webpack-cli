"use strict";

const fs = require("node:fs");
const { enableCompileCache } = require("node:module");
const os = require("node:os");
const path = require("node:path");
const { run } = require("../../utils/test-utils");

/**
 * Runs the CLI on a configuration that reports the compile cache directory of the
 * child process and the worker thread it starts.
 * @param {Record<string, string>} env variables to set on top of a clean environment
 * @returns {Promise<{ variable: string | null, child: string | null, worker: string | null }>} what it reported
 */
const report = async (env) => {
  const cleanEnv = Object.fromEntries(
    Object.entries(process.env).filter(
      ([name]) => !name.startsWith("NODE_COMPILE_CACHE") && name !== "NODE_DISABLE_COMPILE_CACHE",
    ),
  );
  const { exitCode, stdout } = await run(__dirname, [], {
    env: { ...cleanEnv, ...env },
    extendEnv: false,
  });

  expect(exitCode).toBe(0);

  return JSON.parse(stdout.slice(stdout.indexOf("REPORT") + 6).split("\n")[0]);
};

describe("compile cache", () => {
  // `module.enableCompileCache` is only available on Node.js >= 22.8.0
  if (!enableCompileCache) {
    it("should hand nothing on without a compile cache", async () => {
      expect(await report({})).toEqual({ variable: null, child: null, worker: null });
    });

    return;
  }

  it("should hand the compile cache to child processes and worker threads", async () => {
    const { variable, child, worker } = await report({});

    expect(typeof variable).toBe("string");
    expect(child.startsWith(variable)).toBe(true);
    expect(worker.startsWith(variable)).toBe(true);
  });

  it("should keep a directory the environment already names", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "webpack-cli-compile-cache-"));

    try {
      const { variable, child, worker } = await report({ NODE_COMPILE_CACHE: directory });

      expect(variable).toBe(directory);
      expect(child.startsWith(directory)).toBe(true);
      expect(worker.startsWith(directory)).toBe(true);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it("should hand nothing on when a preload has already enabled the compile cache", async () => {
    const { variable, child, worker } = await report({
      NODE_OPTIONS: `--require ${path.resolve(__dirname, "preload.js")}`,
    });

    // The preload's directory is already version-tagged; handing it on would tag it twice.
    expect(variable).toBeNull();
    expect(child).toBe(worker);
    expect(child.match(/v\d+\.\d+\.\d+-/g)).toHaveLength(1);
  });

  it("should hand nothing on where the compile cache is disabled", async () => {
    expect(await report({ NODE_DISABLE_COMPILE_CACHE: "1" })).toEqual({
      variable: null,
      child: null,
      worker: null,
    });
  });
});
