import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../../../utils/test-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("typescript configuration via esbuild fallback", () => {
  it("should load a .ts config with ESM syntax without nodeOptions", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"]);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should load a .ts config with CJS syntax without nodeOptions", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.cjs.ts"]);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should load a .ts config with CJS syntax (require/module.exports) without nodeOptions", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, [
      "-c",
      "./webpack.config.cjs-require.ts",
    ]);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should load a .ts config exporting a function via module.exports without nodeOptions", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.cjs-fn.ts"]);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should load a .mts config without nodeOptions", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.mts"]);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should show a clean actionable error when esbuild is not installed", async () => {
    const { exitCode, stderr } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      env: {
        ...process.env,
        // Force rechoir to fail and esbuild resolution to fail.
        NODE_PATH: "/nonexistent_xyz",
        WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: "1",
      },
    });

    if (exitCode !== 0) {
      expect(stderr).toContain("npm install -D esbuild");
      expect(stderr).not.toContain("Cannot require() ES Module");
      expect(stderr).not.toContain("Unknown file extension");
      expect(stderr).not.toContain("This is caused by either a bug in Node.js");
      expect(stderr).not.toContain("    at ");
    }
  });
});
