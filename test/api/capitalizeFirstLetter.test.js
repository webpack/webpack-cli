const CLI = require("../../packages/webpack-cli/lib/webpack-cli").default;

describe("capitalizeFirstLetter", () => {
  it("should capitalize first letter", () => {
    const cli = new CLI();

    expect(cli.capitalizeFirstLetter("webpack")).toBe("Webpack");
  });

  it("should return an empty string on passing a non-string value", () => {
    const cli = new CLI();

    expect(cli.capitalizeFirstLetter(true)).toBe("");
  });
});
