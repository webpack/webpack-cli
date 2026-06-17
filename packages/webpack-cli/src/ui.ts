/**
 * webpack-cli shared UI helpers.
 *
 * Small, pure functions that render the CLI's visual "chrome" — branded
 * headers, dividers, status lines, the documentation footer and the
 * `envinfo` tables used by `info`/`version`.
 *
 * They take a `colors` palette so the exact same code renders with or without
 * ANSI colors: when colors are disabled (piped output, `--no-color`, or a
 * plain palette in tests) every function collapses to plain text, so the
 * textual structure stays stable and script-friendly.
 */

export interface UiColors {
  bold: (value?: string) => string;
  cyan: (value?: string) => string;
  blue: (value?: string) => string;
  green: (value?: string) => string;
  red: (value?: string) => string;
  yellow: (value?: string) => string;
}

export interface FooterOptions {
  /** When `true`, the "run --help=verbose" hint is omitted (already verbose). */
  verbose?: boolean;
}

// Every help/info/version screen is indented by two spaces and branded with a
// hexagon that mirrors the webpack logo.
export const UI_INDENT = "  ";
export const UI_DIVIDER_WIDTH = 72;

const STATUS_ICONS = { success: "✔", error: "✖", warning: "⚠", info: "ℹ" } as const;

export type StatusKind = keyof typeof STATUS_ICONS;

/** A horizontal rule used to separate sections. */
export function divider(colors: UiColors): string {
  return `${UI_INDENT}${colors.blue("─".repeat(UI_DIVIDER_WIDTH))}`;
}

/** A branded title, e.g. `⬡ webpack build`. */
export function header(colors: UiColors, title: string): string {
  return `${UI_INDENT}${colors.bold(colors.cyan("⬡"))} ${colors.bold(colors.cyan(title))}`;
}

/** A section heading with an underline, e.g. `Options` followed by a divider. */
export function sectionTitle(colors: UiColors, title: string): string {
  return `${UI_INDENT}${colors.bold(colors.cyan(title))}\n${divider(colors)}`;
}

/** A single status message prefixed with an icon (`✔`/`✖`/`⚠`/`ℹ`). */
export function statusLine(colors: UiColors, kind: StatusKind, message: string): string {
  const color = {
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.cyan,
  }[kind];

  return `${UI_INDENT}${color(STATUS_ICONS[kind])} ${message}`;
}

/** The header block printed at the top of a framed command (`info`, `version`, …). */
export function commandHeader(colors: UiColors, name: string, description?: string): string {
  const lines = ["", header(colors, `webpack ${name}`), divider(colors)];

  if (description) {
    lines.push(`${UI_INDENT}${description}`, "");
  }

  return lines.join("\n");
}

/** The documentation footer shared by every help and framed-command screen. */
export function footer(colors: UiColors, options: FooterOptions = {}): string {
  const lines: string[] = [];

  if (!options.verbose) {
    lines.push(
      `${UI_INDENT}${colors.cyan("ℹ")} Run ${colors.bold("'webpack --help=verbose'")} to see all available commands and options.`,
    );
  }

  lines.push(
    "",
    `${UI_INDENT}${colors.bold("Webpack documentation:")}  ${colors.cyan("https://webpack.js.org/")}`,
    `${UI_INDENT}${colors.bold("CLI documentation:")}      ${colors.cyan("https://webpack.js.org/api/cli/")}`,
    `${UI_INDENT}${colors.bold("Made with")} ${colors.red("♥")} ${colors.bold("by the webpack team")}`,
  );

  return lines.join("\n");
}

/**
 * Renders the plain-text output of `envinfo` (used by `info` and `version`)
 * into branded sections with aligned rows. Section titles keep their trailing
 * colon so existing tooling/assertions that grep for e.g. "System:" keep
 * working, and "requested => resolved" version pairs are shown with a "→"
 * arrow.
 * @param {UiColors} colors The color palette to render with.
 * @param {string} raw The raw multi-line text produced by `envinfo`.
 * @returns {string} The styled, section-divided output.
 */
export function renderEnvinfo(colors: UiColors, raw: string): string {
  const { bold, cyan, green } = colors;
  const lines: string[] = [];
  const sections: { title: string; rows: { label: string; value: string }[] }[] = [];
  let section: (typeof sections)[number] | undefined;

  for (const line of raw.split("\n")) {
    const sectionMatch = /^ {2}(\S[^:]*):\s*$/.exec(line);

    if (sectionMatch) {
      section = { title: sectionMatch[1].trim(), rows: [] };
      sections.push(section);
      continue;
    }

    const rowMatch = /^ {4}([^:]+):\s*(.*)$/.exec(line);

    if (rowMatch && section) {
      section.rows.push({ label: rowMatch[1].trim(), value: rowMatch[2].trim() || "N/A" });
    }
  }

  for (const { title, rows } of sections) {
    if (rows.length === 0) {
      continue;
    }

    const labelWidth = Math.max(...rows.map((row) => row.label.length)) + 1;

    lines.push("", header(colors, `${title}:`), divider(colors));

    for (const { label, value } of rows) {
      const arrowIndex = value.indexOf("=>");
      const renderedValue =
        arrowIndex === -1
          ? green(value)
          : `${green(value.slice(0, arrowIndex).trim())} ${cyan("→")} ${bold(green(value.slice(arrowIndex + 2).trim()))}`;

      lines.push(`${UI_INDENT}${bold(`${label}:`.padEnd(labelWidth))}  ${renderedValue}`);
    }
  }

  return [...lines, divider(colors)].join("\n");
}
