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
