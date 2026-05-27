const { distance } = require("../../packages/webpack-cli/lib/levenshtein");

describe("distance", () => {
  it("should return 0 for equal strings", () => {
    expect(distance("", "")).toBe(0);
    expect(distance("webpack", "webpack")).toBe(0);
  });

  it("should return the length of the other string when one is empty", () => {
    expect(distance("", "abc")).toBe(3);
    expect(distance("abc", "")).toBe(3);
  });

  it("should not depend on argument order", () => {
    expect(distance("kitten", "sitting")).toBe(distance("sitting", "kitten"));
  });

  it("should count single edits", () => {
    expect(distance("server", "serve")).toBe(1);
    expect(distance("test", "tests")).toBe(1);
    expect(distance("cat", "car")).toBe(1);
  });

  it("should compute classic distances", () => {
    expect(distance("kitten", "sitting")).toBe(3);
    expect(distance("flying", "sailing")).toBe(4);
  });

  it("should handle strings longer than 32 characters", () => {
    const a = "a".repeat(40);
    const b = `${"a".repeat(39)}b`;

    expect(distance(a, b)).toBe(1);
    expect(distance("a".repeat(40), "b".repeat(40))).toBe(40);
  });
});
