import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../../../utils/test-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("typescript ecma modules configuration", () => {
  it("should support typescript ecma modules configuration (Node.js build-in support)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      // Fallback to `ts-node/esm` for old Node.js versions
      nodeOptions:
        major >= 22
          ? []
          : [
              "--no-deprecation",
              "--import=data:text/javascript,import { register } from 'node:module'; import { pathToFileURL } from 'node:url'; register('ts-node/esm', pathToFileURL('./'));",
            ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support typescript ecma modules configuration (Node.js build-in support using `--experimental-transform-types`)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      // Fallback to `ts-node/esm` for old Node.js versions
      nodeOptions:
        major >= 22
          ? ["--experimental-transform-types", "--no-warnings"]
          : [
              "--no-deprecation",
              "--import=data:text/javascript,import { register } from 'node:module'; import { pathToFileURL } from 'node:url'; register('ts-node/esm', pathToFileURL('./'));",
            ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support typescript ecma modules configuration (using `--import` and prefer `--import` over built-in feature)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      // Fallback to `ts-node/esm` for old Node.js versions
      nodeOptions:
        major >= 22
          ? []
          : [
              "--no-deprecation",
              "--import=data:text/javascript,import { register } from 'node:module'; import { pathToFileURL } from 'node:url'; register('ts-node/esm', pathToFileURL('./'));",
            ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support typescript ecma modules configuration (using `--import=ts-node/esm`)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      nodeOptions: [
        "--no-deprecation",
        "--import=data:text/javascript,import { register } from 'node:module'; import { pathToFileURL } from 'node:url'; register('ts-node/esm', pathToFileURL('./'));",
        ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
      ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support typescript ecma modules configuration (using `--experimental-loader=ts-node/esm`)", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      env: {
        NODE_NO_WARNINGS: 1,
      },
      nodeOptions: [
        "--no-deprecation",
        "--experimental-loader=ts-node/esm",
        ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
      ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
