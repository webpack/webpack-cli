let CLI;

describe("capitalizeFirstLetter", () => {
  beforeAll(async () => {
    ({ default: CLI } = await import("../../packages/webpack-cli/lib/webpack-cli"));
  });

  it("should capitalize first letter", () => {
    const cli = new CLI();

    expect(cli.capitalizeFirstLetter("webpack")).toBe("Webpack");
  });

  it("should return an empty string on passing a empty string value", () => {
    const cli = new CLI();

    expect(cli.capitalizeFirstLetter("")).toBe("");
  });
});
