/**
 * webpack-cli UI renderer
 * Fully decoupled from CLI logic
 */

export interface Colors {
  bold: (str: string) => string;
  cyan: (str: string) => string;
  blue: (str: string) => string;
  yellow: (str: string) => string;
  green: (str: string) => string;
  red: (str: string) => string;
}

export interface FooterOptions {
  verbose?: boolean;
}

export interface Row {
  label: string;
  value: string;
  color?: (str: string) => string;
}

export interface OptionHelpData {
  optionName: string;
  usage: string;
  short?: string;
  description?: string;
  docUrl: string;
  possibleValues?: string;
}

export interface RenderOptions {
  colors: Colors;
  log: (line: string) => void;
  columns: number;
}

export interface AliasHelpData {
  alias: string;
  canonical: string;
  optionHelp: OptionHelpData;
}

export interface HelpOption {
  /** e.g. "-c, --config <pathToConfigFile...>" */
  flags: string;
  description: string;
}

export interface CommandHelpData {
  /** e.g. "build", "serve", "info" */
  name: string;
  /** e.g. "webpack build|bundle|b [entries...] [options]" */
  usage: string;
  description: string;
  options: HelpOption[];
  globalOptions: HelpOption[];
}

/** Passed to `renderCommandHeader` to describe the running command. */
export interface CommandMeta {
  name: string;
  description: string;
}

/** One section emitted by `renderInfoOutput`, e.g. "System" or "Binaries". */
export interface InfoSection {
  title: string;
  rows: Row[];
}

// ─── Layout constants ─────────────────────────────────────────────
export const MAX_WIDTH = 80;
export const INDENT = 2;
export const COL_GAP = 2;
export const MIN_DIVIDER = 10;

const indent = (n: number) => " ".repeat(n);

function divider(width: number, colors: Colors): string {
  const len = Math.max(MIN_DIVIDER, Math.min(width, MAX_WIDTH) - INDENT * 2 - 2);
  return `${indent(INDENT)}${colors.blue("─".repeat(len))}`;
}

function wrapValue(text: string, width: number): string[] {
  if (text.length <= width) return [text];

  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (word.length > width) {
      if (current) {
        lines.push(current);
        current = "";
      }
      let remaining = word;
      while (remaining.length > width) {
        lines.push(remaining.slice(0, width));
        remaining = remaining.slice(width);
      }
      current = remaining;
      continue;
    }
    if (current.length + (current ? 1 : 0) + word.length > width) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

export function renderRows(
  rows: Row[],
  colors: Colors,
  log: (s: string) => void,
  termWidth: number,
): void {
  const labelWidth = Math.max(...rows.map((r) => r.label.length));
  const valueWidth = termWidth - INDENT - labelWidth - COL_GAP;
  const continuation = indent(INDENT + labelWidth + COL_GAP);

  for (const { label, value, color } of rows) {
    const lines = wrapValue(value, valueWidth);
    const colorFn = color ?? ((str: string) => str);
    log(
      `${indent(INDENT)}${colors.bold(label.padEnd(labelWidth))}${indent(COL_GAP)}${colorFn(lines[0])}`,
    );
    for (let i = 1; i < lines.length; i++) {
      log(`${continuation}${colorFn(lines[i])}`);
    }
  }
}

export function renderCommandHeader(meta: CommandMeta, opts: RenderOptions): void {
  const { colors, log } = opts;
  const termWidth = Math.min(opts.columns || MAX_WIDTH, MAX_WIDTH);

  log("");
  log(`${indent(INDENT)}${colors.bold(colors.cyan("⬡"))} ${colors.bold(`webpack ${meta.name}`)}`);
  log(divider(termWidth, colors));

  if (meta.description) {
    const descWidth = termWidth - INDENT * 2;
    for (const line of wrapValue(meta.description, descWidth)) {
      log(`${indent(INDENT)}${line}`);
    }
    log("");
  }
}

export function renderCommandFooter(opts: RenderOptions): void {
  const termWidth = Math.min(opts.columns, MAX_WIDTH);
  opts.log(divider(termWidth, opts.colors));
  opts.log("");
}

function _renderHelpOptions(
  options: HelpOption[],
  colors: Colors,
  push: (line: string) => void,
  termWidth: number,
  flagsWidth: number,
): void {
  const descWidth = termWidth - INDENT - flagsWidth - COL_GAP;
  const continuation = indent(INDENT + flagsWidth + COL_GAP);

  for (const { flags, description } of options) {
    const descLines = wrapValue(description || "", descWidth);
    const flagsPadded = flags.padEnd(flagsWidth);
    push(`${indent(INDENT)}${colors.cyan(flagsPadded)}${indent(COL_GAP)}${descLines[0] ?? ""}`);
    for (let i = 1; i < descLines.length; i++) {
      push(`${continuation}${descLines[i]}`);
    }
  }
}

export function renderCommandHelp(data: CommandHelpData, opts: RenderOptions): void {
  const { colors } = opts;
  const termWidth = Math.min(opts.columns || MAX_WIDTH, MAX_WIDTH);
  const div = divider(termWidth, colors);

  const lines: string[] = [];
  const push = (line: string) => lines.push(line);

  push("");
  push(`${indent(INDENT)}${colors.bold(colors.cyan("⬡"))} ${colors.bold(`webpack ${data.name}`)}`);
  push(div);

  const descWidth = termWidth - INDENT * 2;
  for (const line of wrapValue(data.description, descWidth)) {
    push(`${indent(INDENT)}${line}`);
  }

  push("");
  const usageLabel = `${colors.bold("Usage:")}  `;
  const usageIndent = indent(INDENT + "Usage:  ".length);
  const usageWidth = termWidth - INDENT - "Usage:  ".length;
  const usageLines = wrapValue(data.usage, usageWidth);
  push(`${indent(INDENT)}${usageLabel}${usageLines[0]}`);
  for (let i = 1; i < usageLines.length; i++) push(`${usageIndent}${usageLines[i]}`);

  push("");

  const allFlags = [...data.options, ...data.globalOptions].map((opt) => opt.flags.length);
  const flagsWidth = Math.min(38, allFlags.length > 0 ? Math.max(...allFlags) + COL_GAP : 20);

  if (data.options.length > 0) {
    push(`${indent(INDENT)}${colors.bold(colors.cyan("Options"))}`);
    push(div);
    _renderHelpOptions(data.options, colors, push, termWidth, flagsWidth);
    push("");
  }

  if (data.globalOptions.length > 0) {
    push(`${indent(INDENT)}${colors.bold(colors.cyan("Global options"))}`);
    push(div);
    _renderHelpOptions(data.globalOptions, colors, push, termWidth, flagsWidth);
    push("");
  }

  push(div);
  push(
    `  ${colors.cyan("ℹ")} Run ${colors.bold(`'webpack help ${data.name} --verbose'`)} to see all available options.`,
  );
  push("");

  for (const line of lines) opts.log(line);
}

export function renderOptionHelp(data: OptionHelpData, opts: RenderOptions): void {
  const { colors, log } = opts;
  const termWidth = Math.min(opts.columns, MAX_WIDTH);

  const rows: Row[] = [{ label: "Usage", value: data.usage, color: colors.green }];
  if (data.short) rows.push({ label: "Short", value: data.short, color: colors.green });
  if (data.description) rows.push({ label: "Description", value: data.description });
  rows.push({ label: "Documentation", value: data.docUrl, color: colors.cyan });
  if (data.possibleValues) {
    rows.push({ label: "Possible values", value: data.possibleValues, color: colors.yellow });
  }

  const div = divider(termWidth, colors);
  log("");
  log(
    `${indent(INDENT)}${colors.bold(colors.cyan("⬡"))} ${colors.bold(colors.cyan(data.optionName))}`,
  );
  log(div);
  renderRows(rows, colors, log, termWidth);
  log(div);
  log("");
}

export function renderAliasHelp(data: AliasHelpData, opts: RenderOptions): void {
  const { colors, log } = opts;
  const termWidth = Math.min(opts.columns, MAX_WIDTH);
  const div = divider(termWidth, colors);

  log("");
  log(
    `${indent(INDENT)}${colors.bold(colors.yellow("⬡"))} ${colors.bold(colors.yellow(data.alias))}` +
      `  ${colors.yellow("→")}  ` +
      `${colors.bold(colors.cyan(data.canonical))}`,
  );
  log(`${indent(INDENT)}${colors.yellow("alias for")} ${colors.bold(data.canonical)}`);
  log(div);
  renderOptionHelp(data.optionHelp, opts);
}

export function renderError(message: string, opts: RenderOptions): void {
  const { colors, log } = opts;
  log(`${indent(INDENT)}${colors.red("✖")} ${colors.bold(message)}`);
}

export function renderSuccess(message: string, opts: RenderOptions): void {
  const { colors, log } = opts;
  log(`${indent(INDENT)}${colors.green("✔")} ${colors.bold(message)}`);
}

export function renderWarning(message: string, opts: RenderOptions): void {
  const { colors, log } = opts;
  log(`${indent(INDENT)}${colors.yellow("⚠")} ${message}`);
}

export function renderInfo(message: string, opts: RenderOptions): void {
  const { colors, log } = opts;
  log(`${indent(INDENT)}${colors.cyan("ℹ")} ${message}`);
}

export function parseEnvinfoSections(raw: string): InfoSection[] {
  const sections: InfoSection[] = [];
  let current: InfoSection | null = null;

  for (const line of raw.split("\n")) {
    const sectionMatch = line.match(/^ {2}([^:]+):\s*$/);
    if (sectionMatch) {
      if (current) sections.push(current);
      current = { title: sectionMatch[1].trim(), rows: [] };
      continue;
    }

    const rowMatch = line.match(/^ {4}([^:]+):\s+(.+)$/);
    if (rowMatch && current) {
      current.rows.push({ label: rowMatch[1].trim(), value: rowMatch[2].trim() });
      continue;
    }

    const emptyRowMatch = line.match(/^ {4}([^:]+):\s*$/);
    if (emptyRowMatch && current) {
      current.rows.push({ label: emptyRowMatch[1].trim(), value: "N/A", color: (str) => str });
    }
  }

  if (current) sections.push(current);
  return sections.filter((section) => section.rows.length > 0);
}

export function renderInfoOutput(rawEnvinfo: string, opts: RenderOptions): void {
  const { colors, log } = opts;
  const termWidth = Math.min(opts.columns, MAX_WIDTH);
  const div = divider(termWidth, colors);
  const sections = parseEnvinfoSections(rawEnvinfo);

  log("");

  for (const section of sections) {
    log(
      `${indent(INDENT)}${colors.bold(colors.cyan("⬡"))} ${colors.bold(colors.cyan(section.title))}`,
    );
    log(div);
    renderRows(section.rows, colors, log, termWidth);
    log(div);
    log("");
  }
}

export function renderVersionOutput(rawEnvinfo: string, opts: RenderOptions): void {
  const { colors, log } = opts;
  const termWidth = Math.min(opts.columns, MAX_WIDTH);
  const div = divider(termWidth, colors);
  const sections = parseEnvinfoSections(rawEnvinfo);

  for (const section of sections) {
    log("");
    log(
      `${indent(INDENT)}${colors.bold(colors.cyan("⬡"))} ${colors.bold(colors.cyan(section.title))}`,
    );
    log(div);

    const labelWidth = Math.max(...section.rows.map((row) => row.label.length));

    for (const { label, value } of section.rows) {
      const arrowIdx = value.indexOf("=>");

      if (arrowIdx !== -1) {
        const requested = value.slice(0, arrowIdx).trim();
        const resolved = value.slice(arrowIdx + 2).trim();
        log(
          `${indent(INDENT)}${colors.bold(label.padEnd(labelWidth))}${indent(COL_GAP)}` +
            `${colors.cyan(requested.padEnd(12))}  ${colors.cyan("→")}  ${colors.green(colors.bold(resolved))}`,
        );
      } else {
        log(
          `${indent(INDENT)}${colors.bold(label.padEnd(labelWidth))}${indent(COL_GAP)}${colors.green(value)}`,
        );
      }
    }
    log(div);
  }
}

export function renderSection(title: string, opts: RenderOptions): void {
  const { colors, log } = opts;
  const termWidth = Math.min(opts.columns, MAX_WIDTH);
  log("");
  log(`${indent(INDENT)}${colors.bold(title)}`);
  log(divider(termWidth, colors));
}

export function renderFooter(opts: RenderOptions, footer: FooterOptions = {}): void {
  const { colors, log } = opts;

  if (!footer.verbose) {
    log(
      `  ${colors.cyan("ℹ")} Run ${colors.bold("'webpack --help=verbose'")} to see all available commands and options.`,
    );
  }

  log("");
  log(`  ${colors.bold("Webpack documentation:")}  ${colors.cyan("https://webpack.js.org/")}`);
  log(
    `  ${colors.bold("CLI documentation:")}      ${colors.cyan("https://webpack.js.org/api/cli/")}`,
  );
  log(`  ${colors.bold("Made with")} ${colors.red("♥")}  ${colors.bold("by the webpack team")}`);
  log("");
}
