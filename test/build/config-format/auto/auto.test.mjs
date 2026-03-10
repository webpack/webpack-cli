import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../../../utils/test-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("auto loading different formats of configuration", () => {
  it("should support configuration (Node.js build-in support)", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.js"], {
      nodeOptions: [],
    });

    expect(stderr).toContain(
      "Reparsing as ES module because module syntax was detected. This incurs a performance overhead.",
    );
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support configuration (Node.js build-in support) with `mjs` extension", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.mjs"], {
      nodeOptions: [],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should support configuration (Node.js build-in support) with `cjs` extension", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.cjs"], {
      nodeOptions: [],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
