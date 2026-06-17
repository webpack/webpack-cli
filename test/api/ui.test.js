"use strict";

const ui = require("../../packages/webpack-cli/lib/ui");

// A plain (identity) palette so snapshots show the rendered *structure* as
// printed when colors are disabled (piped output / `--no-color`). This is
// exactly what scripts and the test harness see.
const plainColors = {
  bold: (value = "") => value,
  cyan: (value = "") => value,
  blue: (value = "") => value,
  green: (value = "") => value,
  red: (value = "") => value,
  yellow: (value = "") => value,
};

// A palette that wraps each token so we can assert colors are applied at all
// (and applied to the right pieces) without depending on ANSI escape codes.
const tagColors = {
  bold: (value = "") => `<b>${value}</b>`,
  cyan: (value = "") => `<cyan>${value}</cyan>`,
  blue: (value = "") => `<blue>${value}</blue>`,
  green: (value = "") => `<green>${value}</green>`,
  red: (value = "") => `<red>${value}</red>`,
  yellow: (value = "") => `<yellow>${value}</yellow>`,
};

describe("ui renderer", () => {
  it("renders a branded header", () => {
    expect(ui.header(plainColors, "webpack build")).toMatchSnapshot();
  });

  it("colorizes the header tokens", () => {
    expect(ui.header(tagColors, "webpack build")).toMatchSnapshot();
  });

  it("renders a section title with an underline", () => {
    expect(ui.sectionTitle(plainColors, "Options")).toMatchSnapshot();
  });

  it("renders the command header block with a description", () => {
    expect(
      ui.commandHeader(plainColors, "info", "System and environment information."),
    ).toMatchSnapshot();
  });

  it("renders the command header block without a description", () => {
    expect(ui.commandHeader(plainColors, "configtest")).toMatchSnapshot();
  });

  it.each(["success", "error", "warning", "info"])("renders a %s status line", (kind) => {
    expect(ui.statusLine(plainColors, kind, "Something happened.")).toMatchSnapshot();
  });

  it("renders the footer", () => {
    expect(ui.footer(plainColors)).toMatchSnapshot();
  });

  it("renders the footer in verbose mode (no hint)", () => {
    expect(ui.footer(plainColors, { verbose: true })).toMatchSnapshot();
  });

  describe("renderEnvinfo", () => {
    it("renders `info`-style output into aligned sections", () => {
      const raw = [
        "",
        "  System:",
        "    OS: Linux 6.0 Ubuntu",
        "    CPU: (4) x64 Intel",
        "    Memory: 1.00 GB / 2.00 GB",
        "  Binaries:",
        "    Node: 1.2.3 - /usr/bin/node",
        "    npm: 4.5.6 - /usr/bin/npm",
        "",
      ].join("\n");

      expect(ui.renderEnvinfo(plainColors, raw)).toMatchSnapshot();
    });

    it("renders `version`-style output with resolved arrows", () => {
      const raw = [
        "",
        "  Packages:",
        "    webpack: ^5.0.0 => 5.1.2 ",
        "    webpack-cli: ^6.0.0 => 6.1.0 ",
        "",
      ].join("\n");

      expect(ui.renderEnvinfo(plainColors, raw)).toMatchSnapshot();
    });

    it("falls back to N/A for empty values", () => {
      const raw = ["  System:", "    OS: ", ""].join("\n");

      expect(ui.renderEnvinfo(plainColors, raw)).toMatchSnapshot();
    });
  });
});
