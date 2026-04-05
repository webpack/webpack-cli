import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../../../utils/test-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("typescript configuration", () => {
  const [major] = process.versions.node.split(".").map(Number);

  // Due to problems with nyc
  (major >= 22 ? it : it.skip)(
    "should support typescript configuration (Node.js build-in support)",
    async () => {
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

      /* eslint-disable jest/no-standalone-expect */
      // esbuild handles transpilation cleanly — no Node.js "Reparsing" warning.
      expect(stderr).toBeFalsy();

      expect(stdout).toBeTruthy();
      expect(exitCode).toBe(0);
      expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
      /* eslint-enable jest/no-standalone-expect */
    },
  );

  it("should support typescript configuration (Node.js build-in support) with `mts` extension", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.mts"], {
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

  it("should support typescript configuration (Node.js build-in support) with `cts` extension", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.cts"], {
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
});
