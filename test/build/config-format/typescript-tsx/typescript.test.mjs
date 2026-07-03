import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../../../utils/test-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The repository itself has working `interpret` loaders installed (`ts-node`,
// `@babel/register`, ...), so to prove the `tsx` fallback is really used this
// fixture shadows every loader `interpret` knows for TypeScript and JSX with
// a stub that throws. `tsx` itself is intentionally NOT stubbed: it must be resolved
// from the repository root, so the real package is exercised.
const loaderStubs = [
  "ts-node/register.js",
  "sucrase/register/ts.js",
  "sucrase/register/jsx.js",
  "@babel/register/index.js",
  "esbuild-register/dist/node.js",
  "@swc/register/index.js",
];

describe("typescript configuration with tsx", () => {
  beforeAll(() => {
    for (const stub of loaderStubs) {
      const stubPath = join(__dirname, "node_modules", stub);

      mkdirSync(dirname(stubPath), { recursive: true });
      writeFileSync(stubPath, `throw new Error("stub: '${stub}' is disabled in this fixture");\n`);
    }
  });

  it("should load a `.ts` configuration through the `tsx` fallback", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.ts"], {
      nodeOptions: [
        // Disable built-in type stripping so the `interpret`/`tsx` fallback is exercised
        ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
      ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/foo.bundle.js"))).toBeTruthy();
  });

  it("should load a `.mts` configuration through the `tsx` fallback", async () => {
    const [major] = process.versions.node.split(".").map(Number);
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.mts"], {
      nodeOptions: [
        // Disable built-in type stripping so the `tsx` fallback is exercised
        ...(major >= 22 ? ["--no-experimental-strip-types"] : []),
      ],
    });

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/bar.bundle.js"))).toBeTruthy();
  });

  it("should load a `.jsx` configuration through the `tsx` fallback", async () => {
    const { exitCode, stderr, stdout } = await run(__dirname, ["-c", "./webpack.config.jsx"]);

    expect(stderr).toBeFalsy();
    expect(stdout).toBeTruthy();
    expect(exitCode).toBe(0);
    expect(existsSync(resolve(__dirname, "dist/baz.bundle.js"))).toBeTruthy();
  });
});
