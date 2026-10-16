"use strict";

const { cleanStderr } = require("../utils/test-utils");

const TRACE_WARNINGS_HINT =
  "(Use `node --trace-warnings ...` to show where the warning was created)";
const TRACE_DEPRECATION_HINT =
  "(Use `node --trace-deprecation ...` to show where the warning was created)";

describe("cleanStderr", () => {
  it("should return non-string values as is", () => {
    expect(cleanStderr(undefined)).toBeUndefined();
  });

  it("should drop a Node.js experimental warning and its hint", () => {
    expect(
      cleanStderr(
        `(node:1) ExperimentalWarning: Type Stripping is experimental\n${TRACE_WARNINGS_HINT}\n`,
      ),
    ).toBe("");
  });

  it("should drop a multi-line Node.js warning up to its hint", () => {
    expect(
      cleanStderr(
        `(node:1) ExperimentalWarning: first line\nsecond line\n${TRACE_WARNINGS_HINT}\n(node:1) ExperimentalWarning: again\n`,
      ),
    ).toBe("");
  });

  it("should drop Node.js core deprecations raised inside dependencies", () => {
    expect(
      cleanStderr(`(node:1) [DEP0040] DeprecationWarning: punycode\n${TRACE_DEPRECATION_HINT}`),
    ).toBe("");
  });

  it("should drop webpack infrastructure info logs", () => {
    expect(cleanStderr("<i> [webpack-bundle-analyzer] Started\n<i> Use Ctrl+C to close it\n")).toBe(
      "",
    );
  });

  it("should keep webpack deprecations, warnings and errors", () => {
    const stderr = [
      "(node:1) [DEP_WEBPACK_COMPILATION_ASSETS] DeprecationWarning: deprecated",
      "<w> [plugin] warning",
      "<e> [plugin] error",
    ].join("\n");

    expect(cleanStderr(stderr)).toBe(stderr);
  });

  it("should keep CLI output found between a warning without hint and a later hint", () => {
    expect(
      cleanStderr(
        `(node:1) ExperimentalWarning: no hint here\n[webpack-cli] Error: boom\n${TRACE_WARNINGS_HINT}`,
      ),
    ).toContain("[webpack-cli] Error: boom");
  });
});
