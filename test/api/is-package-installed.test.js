const CLI = require("../../packages/webpack-cli/lib/webpack-cli").default;

describe("isPackageInstalled", () => {
  let cli;

  beforeEach(() => {
    cli = new CLI();
  });

  it("should return true for installed package", async () => {
    expect(await cli.isPackageInstalled("webpack")).toBe(true);
  });

  it("should return false for uninstalled package", async () => {
    expect(await cli.isPackageInstalled("unknown")).toBe(false);
  });
});
