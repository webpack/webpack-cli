import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../../../utils/test-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("typescript configuration with tsx", () => {
  it("should support `webpack --mode=production` with only `tsx` installed", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["--mode=production"], {
      nodeOptions: [
        // Disable TypeScript strip types so this test exercises the interpret fallback.
        ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
      ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });
});
