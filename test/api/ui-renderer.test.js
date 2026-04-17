const {
  INDENT,
  MAX_WIDTH,
  parseEnvinfoSections,
  renderAliasHelp,
  renderCommandFooter,
  renderCommandHeader,
  renderCommandHelp,
  renderError,
  renderFooter,
  renderInfo,
  renderInfoOutput,
  renderOptionHelp,
  renderSuccess,
  renderVersionOutput,
  renderWarning,
} = require("../../packages/webpack-cli/lib/ui-renderer");

const stripAnsi = (str) => str.replaceAll(/\u001B\[[0-9;]*m/g, "");

const makeOpts = (columns = 80) => {
  const lines = [];
  return {
    captured: lines,
    opts: {
      columns,
      log: (line) => lines.push(line),
      colors: {
        bold: (s) => s,
        cyan: (s) => s,
        blue: (s) => s,
        yellow: (s) => s,
        green: (s) => s,
        red: (s) => s,
      },
    },
  };
};

const getOutput = (lines) => lines.join("\n");

const ENVINFO_FIXTURE = `
  System:
    OS: macOS 14.0
    CPU: Apple M2
    Memory: 16 GB

  Binaries:
    Node: 20.1.0
    npm: 9.6.7
    pnpm: Not Found

  Packages:
    webpack: ^5.105.4 => 5.105.4
    webpack-cli: ^6.0.0 => 6.0.1
    webpack-dev-server: ^5.1.0 => 5.2.3
`;

const COMMAND_HELP_BUILD = {
  name: "build",
  usage: "webpack build|bundle|b [entries...] [options]",
  description: "Run webpack (default command, can be omitted).",
  options: [
    {
      flags: "-c, --config <pathToConfigFile...>",
      description: "Provide path to one or more webpack configuration files.",
    },
    {
      flags: "--config-name <name...>",
      description:
        "Name(s) of particular configuration(s) to use if configuration file exports an array of multiple configurations.",
    },
    {
      flags: "-m, --merge",
      description: "Merge two or more configurations using 'webpack-merge'.",
    },
    {
      flags: "--mode <value>",
      description: "Enable production optimizations or development hints.",
    },
    {
      flags: "-o, --output-path <value>",
      description: "The output directory as absolute path (required).",
    },
    { flags: "-w, --watch", description: "Enter watch mode, which rebuilds on file change." },
  ],
  globalOptions: [
    { flags: "--color", description: "Enable colors on console." },
    { flags: "--no-color", description: "Disable colors on console." },
    { flags: "-v, --version", description: "Output the version number." },
    { flags: "-h, --help [verbose]", description: "Display help for commands and options." },
  ],
};

const COMMAND_HELP_INFO = {
  name: "info",
  usage: "webpack info|i [options]",
  description: "Outputs information about your system.",
  options: [
    {
      flags: "-o, --output <value>",
      description: "Get output in a specified format (json or markdown).",
    },
    {
      flags: "-a, --additional-package <value>",
      description: "Adds additional packages to the output.",
    },
  ],
  globalOptions: COMMAND_HELP_BUILD.globalOptions,
};

describe("renderVersionOutput", () => {
  it("should render section title", () => {
    const { captured, opts } = makeOpts();
    renderVersionOutput(ENVINFO_FIXTURE, opts);
    expect(getOutput(captured)).toContain("Packages");
  });

  it("should render package names", () => {
    const { captured, opts } = makeOpts();
    renderVersionOutput(ENVINFO_FIXTURE, opts);
    const output = getOutput(captured);
    expect(output).toContain("webpack");
    expect(output).toContain("webpack-cli");
  });

  it("should render the → arrow for range => resolved rows", () => {
    const { captured, opts } = makeOpts();
    renderVersionOutput(ENVINFO_FIXTURE, opts);
    expect(getOutput(captured)).toContain("→");
  });

  it("should render requested range and resolved version separately", () => {
    const { captured, opts } = makeOpts();
    renderVersionOutput(ENVINFO_FIXTURE, opts);
    const output = getOutput(captured);
    expect(output).toContain("^5.105.4");
    expect(output).toContain("5.105.4");
    expect(output).not.toContain("=>");
  });

  it("should emit exactly one closing divider per section — not two", () => {
    const { captured, opts } = makeOpts();
    renderVersionOutput(ENVINFO_FIXTURE, opts);
    let consecutiveDividers = 0;
    for (let i = 1; i < captured.length; i++) {
      if (/─{10,}/.test(captured[i]) && /─{10,}/.test(captured[i - 1])) {
        consecutiveDividers++;
      }
    }
    expect(consecutiveDividers).toBe(0);
  });

  it("should not overflow terminal width", () => {
    const { captured, opts } = makeOpts(80);
    renderVersionOutput(ENVINFO_FIXTURE, opts);
    const overflowing = captured.filter((l) => stripAnsi(l).length > 82);
    expect(overflowing).toHaveLength(0);
  });

  it("should align all package names to the same column", () => {
    const { captured, opts } = makeOpts();
    renderVersionOutput(ENVINFO_FIXTURE, opts);
    const versionLines = captured.filter((l) => stripAnsi(l).includes("→"));
    const arrowPositions = versionLines.map((l) => stripAnsi(l).indexOf("→"));
    expect(new Set(arrowPositions).size).toBe(1);
  });

  it("should match full output snapshot", () => {
    const { captured, opts } = makeOpts();
    renderVersionOutput(ENVINFO_FIXTURE, opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderCommandHelp", () => {
  it("should render the command name in the header", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    expect(getOutput(captured)).toContain("webpack build");
  });

  it("should render the command description", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    expect(getOutput(captured)).toContain("Run webpack");
  });

  it("should render the Usage line with aliases", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    expect(getOutput(captured)).toContain("build|bundle|b");
  });

  it("should render all option flags", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    const output = getOutput(captured);
    expect(output).toContain("--config");
    expect(output).toContain("--mode");
    expect(output).toContain("--watch");
  });

  it("should render all option descriptions", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    const output = getOutput(captured);
    expect(output).toContain("Provide path");
    expect(output).toContain("watch mode");
  });

  it("should render the Options section header", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    expect(getOutput(captured)).toContain("Options");
  });

  it("should render the Global options section header", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    expect(getOutput(captured)).toContain("Global options");
  });

  it("should render global option flags", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    expect(getOutput(captured)).toContain("--color");
    expect(getOutput(captured)).toContain("--no-color");
  });

  it("should use the same column width for Options and Global options", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    const optionLines = captured.filter((l) => stripAnsi(l).startsWith("  -"));
    const descStarts = optionLines
      .map((l) => {
        const stripped = stripAnsi(l);
        const match = stripped.match(/^ {2}\S.*?  +/);
        return match ? match[0].length : null;
      })
      .filter((n) => n !== null);
    expect(new Set(descStarts).size).toBe(1);
  });

  it("should wrap long descriptions within terminal width", async () => {
    const longDesc = {
      ...COMMAND_HELP_BUILD,
      options: [{ flags: "--very-long-option-name", description: "A ".repeat(80).trim() }],
    };
    const { captured, opts } = makeOpts(80);
    renderCommandHelp(longDesc, opts);
    const overflowing = captured.filter((l) => stripAnsi(l).length > 82);
    expect(overflowing).toHaveLength(0);
  });

  it("should work for the info command", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_INFO, opts);
    const output = getOutput(captured);
    expect(output).toContain("webpack info");
    expect(output).toContain("--output");
    expect(output).toContain("--additional-package");
  });

  it("should not overflow terminal width", async () => {
    const { captured, opts } = makeOpts(80);
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    const overflowing = captured.filter((l) => stripAnsi(l).length > 82);
    expect(overflowing).toHaveLength(0);
  });

  it("should not paginate when paginate=false even with many options", async () => {
    const manyOptions = Array.from({ length: 40 }, (_, i) => ({
      flags: `--option-${i}`,
      description: `Description for option ${i}`,
    }));
    const { captured, opts } = makeOpts();
    renderCommandHelp({ ...COMMAND_HELP_BUILD, options: manyOptions }, opts);
    expect(captured.filter((l) => l.includes("--option-"))).toHaveLength(40);
  });

  it("should match full output snapshot for build command", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_BUILD, opts);
    expect(captured).toMatchSnapshot();
  });

  it("should match full output snapshot for info command", async () => {
    const { captured, opts } = makeOpts();
    renderCommandHelp(COMMAND_HELP_INFO, opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderCommandHeader", () => {
  it("should render 'webpack <name>' in the header", () => {
    const { captured, opts } = makeOpts();
    renderCommandHeader({ name: "build", description: "Compiling." }, opts);
    expect(getOutput(captured)).toContain("webpack build");
  });

  it("should render the description", () => {
    const { captured, opts } = makeOpts();
    renderCommandHeader({ name: "build", description: "Compiling." }, opts);
    expect(getOutput(captured)).toContain("Compiling.");
  });

  it("should render a divider", () => {
    const { captured, opts } = makeOpts();
    renderCommandHeader({ name: "build", description: "Compiling." }, opts);
    expect(captured.some((l) => /─{10,}/.test(l))).toBe(true);
  });

  it("should include the ⬡ icon", () => {
    const { captured, opts } = makeOpts();
    renderCommandHeader({ name: "build", description: "Compiling." }, opts);
    expect(getOutput(captured)).toContain("⬡");
  });

  it("should omit description block when empty", () => {
    const { captured, opts } = makeOpts();
    renderCommandHeader({ name: "build", description: "" }, opts);
    const nonEmpty = captured.filter((l) => l.trim().length > 0);
    expect(nonEmpty).toHaveLength(2); // icon+title + divider
  });

  it("should cap divider at MAX_WIDTH on wide terminals", () => {
    const { captured, opts } = makeOpts(300);
    renderCommandHeader({ name: "build", description: "Building." }, opts);
    const div = captured.find((l) => /─{10,}/.test(l));
    expect(stripAnsi(div).length).toBeLessThanOrEqual(INDENT + MAX_WIDTH);
  });

  it("should match snapshot", () => {
    const { captured, opts } = makeOpts();
    renderCommandHeader({ name: "build", description: "Compiling." }, opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderCommandFooter", () => {
  it("should render a divider", () => {
    const { captured, opts } = makeOpts();
    renderCommandFooter(opts);
    expect(captured.some((l) => /─{10,}/.test(l))).toBe(true);
  });

  it("should end with a blank line", () => {
    const { captured, opts } = makeOpts();
    renderCommandFooter(opts);
    expect(captured[captured.length - 1]).toBe("");
  });

  it("header and footer dividers should be the same length", () => {
    const hCapture = makeOpts(80);
    renderCommandHeader({ name: "build", description: "" }, hCapture.opts);
    const hDiv = hCapture.captured.find((l) => /─{10,}/.test(l));

    const fCapture = makeOpts(80);
    renderCommandFooter(fCapture.opts);
    const fDiv = fCapture.captured.find((l) => /─{10,}/.test(l));

    expect(stripAnsi(hDiv)).toHaveLength(stripAnsi(fDiv).length);
  });

  it("should match snapshot", () => {
    const { captured, opts } = makeOpts();
    renderCommandFooter(opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderOptionHelp", () => {
  it("should render option name in header", () => {
    const { captured, opts } = makeOpts();
    renderOptionHelp(
      {
        optionName: "--mode",
        usage: "webpack --mode <value>",
        docUrl: "https://webpack.js.org/option/mode/",
      },
      opts,
    );
    expect(getOutput(captured)).toContain("--mode");
  });

  it("should render dividers", () => {
    const { captured, opts } = makeOpts();
    renderOptionHelp(
      {
        optionName: "--mode",
        usage: "webpack --mode <value>",
        docUrl: "https://webpack.js.org/option/mode/",
      },
      opts,
    );
    expect(captured.filter((l) => /─{10,}/.test(l)).length).toBeGreaterThanOrEqual(2);
  });

  it("should render Usage row", () => {
    const { captured, opts } = makeOpts();
    renderOptionHelp(
      {
        optionName: "--mode",
        usage: "webpack --mode <value>",
        docUrl: "https://webpack.js.org/option/mode/",
      },
      opts,
    );
    expect(getOutput(captured)).toContain("Usage");
  });

  it("should render Short row when provided", () => {
    const { captured, opts } = makeOpts();
    renderOptionHelp(
      {
        optionName: "--devtool",
        usage: "webpack --devtool <value>",
        short: "webpack -d <value>",
        docUrl: "https://webpack.js.org/option/devtool/",
      },
      opts,
    );
    expect(getOutput(captured)).toContain("Short");
  });

  it("should not render Short row when absent", () => {
    const { captured, opts } = makeOpts();
    renderOptionHelp(
      {
        optionName: "--mode",
        usage: "webpack --mode <value>",
        docUrl: "https://webpack.js.org/option/mode/",
      },
      opts,
    );
    expect(getOutput(captured)).not.toContain("Short");
  });

  it("should render Description when provided", () => {
    const { captured, opts } = makeOpts();
    renderOptionHelp(
      {
        optionName: "--mode",
        usage: "webpack --mode <value>",
        description: "Set the mode.",
        docUrl: "https://webpack.js.org/option/mode/",
      },
      opts,
    );
    expect(getOutput(captured)).toContain("Set the mode.");
  });

  it("should render Possible values when provided", () => {
    const { captured, opts } = makeOpts();
    renderOptionHelp(
      {
        optionName: "--mode",
        usage: "webpack --mode <value>",
        docUrl: "https://webpack.js.org/option/mode/",
        possibleValues: "'development' | 'production' | 'none'",
      },
      opts,
    );
    expect(getOutput(captured)).toContain("'development'");
  });

  it("should cap divider width at MAX_WIDTH", () => {
    const { captured, opts } = makeOpts(200);
    renderOptionHelp(
      {
        optionName: "--mode",
        usage: "webpack --mode <value>",
        docUrl: "https://webpack.js.org/option/mode/",
      },
      opts,
    );
    const div = captured.find((l) => /─{10,}/.test(l));
    expect(stripAnsi(div).length).toBeLessThanOrEqual(INDENT + MAX_WIDTH);
  });

  it("should match snapshot with all fields", () => {
    const { captured, opts } = makeOpts();
    renderOptionHelp(
      {
        optionName: "--mode",
        usage: "webpack --mode <value>",
        description: "Enable production optimizations or development hints.",
        docUrl: "https://webpack.js.org/option/mode/",
        possibleValues: "'development' | 'production' | 'none'",
      },
      opts,
    );
    expect(captured).toMatchSnapshot();
  });
});

describe("renderAliasHelp", () => {
  const base = {
    optionName: "--config",
    usage: "webpack --config <pathToConfigFile...>",
    short: "webpack -c <pathToConfigFile...>",
    description: "Provide path to a webpack configuration file.",
    docUrl: "https://webpack.js.org/option/config/",
  };

  it("should show alias, canonical, arrow and alias-for label", () => {
    const { captured, opts } = makeOpts();
    renderAliasHelp({ alias: "-c", canonical: "--config", optionHelp: base }, opts);
    const output = getOutput(captured);
    expect(output).toContain("-c");
    expect(output).toContain("--config");
    expect(output).toContain("→");
    expect(output).toContain("alias for");
  });

  it("should render full option help after redirect", () => {
    const { captured, opts } = makeOpts();
    renderAliasHelp({ alias: "-c", canonical: "--config", optionHelp: base }, opts);
    expect(getOutput(captured)).toContain("Usage");
    expect(getOutput(captured)).toContain("Documentation");
  });

  it("should match snapshot", () => {
    const { captured, opts } = makeOpts();
    renderAliasHelp({ alias: "-c", canonical: "--config", optionHelp: base }, opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderError", () => {
  it("outputs message with ✖", () => {
    const { captured, opts } = makeOpts();
    renderError("something went wrong", opts);
    expect(getOutput(captured)).toContain("✖");
    expect(getOutput(captured)).toContain("something went wrong");
  });

  it("should match snapshot", () => {
    const { captured, opts } = makeOpts();
    renderError("something went wrong", opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderSuccess", () => {
  it("outputs message with ✔", () => {
    const { captured, opts } = makeOpts();
    renderSuccess("all good", opts);
    expect(getOutput(captured)).toContain("✔");
    expect(getOutput(captured)).toContain("all good");
  });

  it("should match snapshot", () => {
    const { captured, opts } = makeOpts();
    renderSuccess("all good", opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderWarning", () => {
  it("outputs message with ⚠", () => {
    const { captured, opts } = makeOpts();
    renderWarning("watch out", opts);
    expect(getOutput(captured)).toContain("⚠");
    expect(getOutput(captured)).toContain("watch out");
  });

  it("should match snapshot", () => {
    const { captured, opts } = makeOpts();
    renderWarning("watch out", opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderInfo", () => {
  it("outputs message with ℹ", () => {
    const { captured, opts } = makeOpts();
    renderInfo("just so you know", opts);
    expect(getOutput(captured)).toContain("ℹ");
    expect(getOutput(captured)).toContain("just so you know");
  });

  it("should match snapshot", () => {
    const { captured, opts } = makeOpts();
    renderInfo("just so you know", opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("parseEnvinfoSections", () => {
  it("returns one section per heading", () => {
    const sections = parseEnvinfoSections(ENVINFO_FIXTURE);
    expect(sections.map((section) => section.title)).toEqual(["System", "Binaries", "Packages"]);
  });

  it("parses key/value rows correctly", () => {
    const sections = parseEnvinfoSections(ENVINFO_FIXTURE);
    const system = sections.find((section) => section.title === "System");
    expect(system.rows).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "OS", value: "macOS 14.0" })]),
    );
  });

  it("returns empty array for empty string", () => {
    expect(parseEnvinfoSections("")).toHaveLength(0);
  });

  it("skips sections with no parseable rows", () => {
    const sections = parseEnvinfoSections("\n  Empty:\n\n  Real:\n    Key: value\n");
    const titles = sections.map((section) => section.title);
    expect(titles).not.toContain("Empty");
    expect(titles).toContain("Real");
  });

  it("sets value to 'N/A' for a row with no value", () => {
    const sections = parseEnvinfoSections("\n  Browsers:\n    Chrome:\n    Node: 20.0.0\n");
    const chrome = sections[0].rows.find((row) => row.label === "Chrome");
    expect(chrome.value).toBe("N/A");
  });

  it("attaches a passthrough color function to an N/A row", () => {
    const sections = parseEnvinfoSections("\n  Browsers:\n    Chrome:\n");
    const chrome = sections[0].rows.find((row) => row.label === "Chrome");
    expect(chrome.color).toBeDefined();
    expect(chrome.color("test")).toBe("test");
  });

  it("does not apply N/A or a color function to a row that has a value", () => {
    const sections = parseEnvinfoSections("\n  Browsers:\n    Node: 20.0.0\n");
    const node = sections[0].rows.find((row) => row.label === "Node");
    expect(node.value).toBe("20.0.0");
    expect(node.color).toBeUndefined();
  });

  it("handles a section where every row is empty", () => {
    const sections = parseEnvinfoSections(
      "\n  Browsers:\n    Chrome:\n    Firefox:\n    Safari:\n",
    );
    expect(sections[0].rows).toHaveLength(3);
    for (const row of sections[0].rows) {
      expect(row.value).toBe("N/A");
      expect(row.color("x")).toBe("x");
    }
  });

  it("handles mixed empty and valued rows in the same section", () => {
    const sections = parseEnvinfoSections(
      "\n  Binaries:\n    Node: 20.0.0\n    Yarn:\n    npm: 10.0.0\n    pnpm:\n",
    );
    // eslint-disable-next-line prefer-destructuring
    const rows = sections[0].rows;
    expect(rows.find((row) => row.label === "Node").value).toBe("20.0.0");
    expect(rows.find((row) => row.label === "Yarn").value).toBe("N/A");
    expect(rows.find((row) => row.label === "npm").value).toBe("10.0.0");
    expect(rows.find((row) => row.label === "pnpm").value).toBe("N/A");
  });

  it("handles complex output with parentheses, paths, and multiple spaces", () => {
    const COMPLEX_FIXTURE = `
  System:
    OS: macOS 14.0 (23A344)
    CPU: (10) arm64 Apple M2 Pro
    Memory: 10.23 GB / 32.00 GB
  Binaries:
    Node: 20.9.0 - /usr/local/bin/node
    Yarn: 1.22.19 - ~/.yarn/bin/yarn
    npm:
  Utilities:
    Git: 2.39.3 (Apple Git-145)
  `;

    const sections = parseEnvinfoSections(COMPLEX_FIXTURE);
    const system = sections.find((str) => str.title === "System");
    const binaries = sections.find((str) => str.title === "Binaries");
    const utilities = sections.find((str) => str.title === "Utilities");
    expect(system.rows.find((row) => row.label === "OS").value).toBe("macOS 14.0 (23A344)");
    expect(system.rows.find((row) => row.label === "CPU").value).toBe("(10) arm64 Apple M2 Pro");
    expect(binaries.rows.find((row) => row.label === "Node").value).toBe(
      "20.9.0 - /usr/local/bin/node",
    );
    expect(binaries.rows.find((row) => row.label === "npm").value).toBe("N/A");
    expect(utilities.rows.find((row) => row.label === "Git").value).toBe("2.39.3 (Apple Git-145)");
  });

  it("should match snapshot", () => {
    const sections = parseEnvinfoSections(ENVINFO_FIXTURE);
    const serialisable = sections.map((section) => ({
      title: section.title,
      rows: section.rows.map(({ label, value }) => ({ label, value })),
    }));
    expect(serialisable).toMatchSnapshot();
  });
});

describe("renderInfoOutput", () => {
  it("renders section headers and key/value rows", () => {
    const { captured, opts } = makeOpts();
    renderInfoOutput(ENVINFO_FIXTURE, opts);
    const output = getOutput(captured);
    expect(output).toContain("System");
    expect(output).toContain("OS");
    expect(output).toContain("macOS 14.0");
  });

  it("does not overflow terminal width", () => {
    const { captured, opts } = makeOpts(80);
    renderInfoOutput(ENVINFO_FIXTURE, opts);
    expect(captured.filter((l) => stripAnsi(l).length > 82)).toHaveLength(0);
  });

  it("produces no meaningful output for empty input", () => {
    const { captured, opts } = makeOpts();
    renderInfoOutput("", opts);
    expect(captured.filter((l) => l.trim().length > 0)).toHaveLength(0);
  });

  it("should match full output snapshot", () => {
    const { captured, opts } = makeOpts();
    renderInfoOutput(ENVINFO_FIXTURE, opts);
    expect(captured).toMatchSnapshot();
  });
});

describe("renderFooter", () => {
  it("shows verbose hint by default, not when verbose=true", () => {
    const { captured: a, opts: optsA } = makeOpts();
    renderFooter(optsA);
    expect(getOutput(a)).toContain("--help=verbose");

    const { captured: b, opts: optsB } = makeOpts();
    renderFooter(optsB, { verbose: true });
    expect(getOutput(b)).not.toContain("--help=verbose");
  });

  it("shows webpack and CLI docs URLs", () => {
    const { captured, opts } = makeOpts();
    renderFooter(opts);
    expect(getOutput(captured)).toContain("https://webpack.js.org/");
    expect(getOutput(captured)).toContain("https://webpack.js.org/api/cli/");
  });

  it("shows made with webpack team message", () => {
    const { captured, opts } = makeOpts();
    renderFooter(opts);
    expect(getOutput(captured)).toContain("webpack team");
  });

  it("should match snapshot (default)", () => {
    const { captured, opts } = makeOpts();
    renderFooter(opts);
    expect(captured).toMatchSnapshot();
  });

  it("should match snapshot (verbose)", () => {
    const { captured, opts } = makeOpts();
    renderFooter(opts, { verbose: true });
    expect(captured).toMatchSnapshot();
  });
});
