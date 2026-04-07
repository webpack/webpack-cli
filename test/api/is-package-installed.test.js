let CLI;

describe("isPackageInstalled", () => {
  beforeAll(async () => {
    ({ default: CLI } = await import("../../packages/webpack-cli/lib/webpack-cli"));
  });

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
