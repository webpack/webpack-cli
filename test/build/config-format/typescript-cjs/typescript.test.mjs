import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../../../utils/test-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("typescript commonjs configuration", () => {
  it("should support typescript commonjs configuration (Node.js build-in support)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      // Fallback to `ts-node/register` for old Node.js versions
      nodeOptions: major >= 22 ? [] : ["--require=ts-node/register"],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support typescript commonjs configuration (using `--require=ts-node/register`)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      nodeOptions: [
        "--require=ts-node/register",
        // Disable typescript strip types for tests
        ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
      ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support typescript commonjs configuration (using `--require=ts-node/register` and disable `interpret`)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["-c", "./webpack.config.ts", "--disable-interpret"],
      {
        nodeOptions: [
          "--require=ts-node/register",
          // Disable typescript strip types for tests
          ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
        ],
      },
    );

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support typescript commonjs configuration (using `--import=ts-node/register` and disable `interpret`)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(
      __dirname,
      ["-c", "./webpack.config.ts", "--disable-interpret"],
      {
        nodeOptions: [
          "--import=ts-node/register",
          // Disable typescript strip types for tests
          ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
        ],
      },
    );

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it.only("should support typescript commonjs configuration (using `interpret`)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      env: {
        WEBPACK_DEBUG_CONFIGURATION_LOADING: true,
      },
      nodeOptions: [
        // Disable typescript strip types for tests
        ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
      ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
