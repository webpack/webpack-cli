const path = require("node:path");

// Simulate Bun's ESM↔CJS interop: the dynamic import of cli-plugin resolves to
// the class itself instead of Node's `{ __esModule, default }` wrapper. Guards
// the interop-safe unwrap in `webpack-cli.ts` against reintroducing the
// Node-only double-`.default` unwrap (which crashes every build under Bun).
jest.mock(
  "../../../packages/webpack-cli/lib/plugins/cli-plugin",
  () => jest.requireActual("../../../packages/webpack-cli/lib/plugins/cli-plugin").default,
);

const CLIPlugin = jest.requireActual(
  "../../../packages/webpack-cli/lib/plugins/cli-plugin",
).default;

describe("CLIPlugin import interop", () => {
  it("applies CLIPlugin when the dynamic import resolves to the class itself", async () => {
    process.env.WEBPACK_PACKAGE = path.resolve(__dirname, "./mock-webpack.js");

    const WebpackCLI = require("../../../packages/webpack-cli/lib/webpack-cli").default;

    const exitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });
    const errors = [];
    const errorSpy = jest
      .spyOn(console, "error")
      .mockImplementation((message) => errors.push(`${message}`));

    try {
      await new WebpackCLI().run(["node", "webpack", "build"]);
    } catch (error) {
      throw new Error(`${error.message}\n${errors.join("\n")}`, {
        cause: error,
      });
    } finally {
      exitSpy.mockRestore();
      errorSpy.mockRestore();
      delete process.env.WEBPACK_PACKAGE;
    }

    const options = globalThis.__capturedWebpackOptions;

    expect(options.plugins[0]).toBeInstanceOf(CLIPlugin);
  });
});
