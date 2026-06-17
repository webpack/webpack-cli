import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { type Readable as ReadableType } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";
import util from "node:util";
import { type stringifyChunked as stringifyChunkedType } from "@discoveryjs/json-ext";
import {
  type Command as CommanderCommand,
  type CommandOptions as CommanderCommandOptions,
  type Help,
  Option,
  type ParseOptions,
  program,
} from "commander";
import { type Config as EnvinfoConfig, type Options as EnvinfoOptions } from "envinfo";
import { type prepare } from "rechoir";
import {
  type Argument as WebpackArgument,
  type Colors as WebpackColors,
  type Compiler,
  type Configuration,
  type FileCacheOptions,
  type MultiCompiler,
  type MultiConfiguration,
  type MultiStats,
  type Problem,
  type Stats,
  type StatsOptions,
  type WebpackError,
  default as webpack,
} from "webpack";
import { type Configuration as DevServerConfiguration } from "webpack-dev-server";

const WEBPACK_PACKAGE_IS_CUSTOM = Boolean(process.env.WEBPACK_PACKAGE);
const WEBPACK_PACKAGE = WEBPACK_PACKAGE_IS_CUSTOM
  ? (process.env.WEBPACK_PACKAGE as string)
  : "webpack";
const WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM = Boolean(process.env.WEBPACK_DEV_SERVER_PACKAGE);
const WEBPACK_DEV_SERVER_PACKAGE = WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM
  ? (process.env.WEBPACK_DEV_SERVER_PACKAGE as string)
  : "webpack-dev-server";

const EXIT_SIGNALS = ["SIGINT", "SIGTERM"];
const DEFAULT_CONFIGURATION_FILES = [
  "webpack.config",
  ".webpack/webpack.config",
  ".webpack/webpackfile",
];

// Non-JavaScript configuration formats that Node.js cannot `import()`.
// webpack-cli reads and parses these itself instead of relying on `interpret`.
// The parsers are intentionally not shipped: the relevant package is imported
// on demand from the user's project, and a helpful error is shown when it is
// missing. `method` is the parser's entry point (`json5`/`toml` expose `parse`,
// `js-yaml` exposes `load`). Hoisted to module scope so it is built only once.
const DATA_FORMAT_LOADERS: Record<string, { package: string; method: "parse" | "load" }> = {
  ".json5": { package: "json5", method: "parse" },
  ".yaml": { package: "js-yaml", method: "load" },
  ".yml": { package: "js-yaml", method: "load" },
  ".toml": { package: "toml", method: "parse" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordAny = Record<string, any>;

interface Rechoir {
  prepare: typeof prepare;
}

interface RechoirError extends Error {
  failures: RechoirError[];
  error: Error;
}

type PackageManager = "pnpm" | "yarn" | "npm";

type StringsKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogHandler = (value: any) => void;

interface Logger {
  error: LogHandler;
  warn: LogHandler;
  info: LogHandler;
  success: LogHandler;
  log: LogHandler;
  raw: LogHandler;
}

interface Colors extends WebpackColors {
  isColorSupported: boolean;
}

type Context = RecordAny;

interface Command extends CommanderCommand {
  pkg?: string;
  forHelp?: boolean;
  context: Context;
}

interface CommandOptions<
  A = void,
  O extends CommanderArgs = CommanderArgs,
  C extends Context = Context,
> extends CommanderCommandOptions {
  rawName: string;
  name: string;
  alias: string | string[];
  description?: string;
  usage?: string;
  dependencies?: string[];
  pkg?: string;
  preload?: () => Promise<C>;
  options?:
    | CommandOption[]
    | ((command: Command & { context: C }) => CommandOption[])
    | ((command: Command & { context: C }) => Promise<CommandOption[]>);
  action: A extends void
    ? (options: O, cmd: Command & { context: C }) => void | Promise<void>
    : (args: A, options: O, cmd: Command & { context: C }) => void | Promise<void>;
}

interface WebpackContext {
  webpack: typeof webpack;
}

interface WebpackDevServerContext {
  devServer: typeof import("webpack-dev-server");
}

interface KnownWebpackCLICommands {
  build: CommandOptions<string[], CommanderArgs, WebpackContext & Context>;
  serve: CommandOptions<
    string[],
    CommanderArgs,
    WebpackContext & WebpackDevServerContext & Context
  >;
  watch: CommandOptions<string[], CommanderArgs, WebpackContext & Context>;
  version: CommandOptions<void, CommanderArgs, Context>;
  help: CommandOptions<void, CommanderArgs, Context>;
  info: CommandOptions<void, CommanderArgs, Context>;
  configtest: CommandOptions<string | undefined, CommanderArgs, WebpackContext & Context>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommanderArgs = Record<string, any>;

type BasicPrimitive = string | boolean | number;

type EnumValue = string | number | boolean | EnumValueObject | EnumValue[] | null;

interface EnumValueObject {
  [key: string]: EnumValue;
}

interface ArgumentConfig {
  description?: string;
  negatedDescription?: string;
  path?: string;
  multiple?: boolean;
  type: "enum" | "string" | "path" | "number" | "boolean" | "RegExp" | "reset";
  values?: EnumValue[];
}

interface CommandOption {
  name: string;
  alias?: string;
  type?: (
    value: string,
    previous: Record<string, BasicPrimitive | object>,
  ) => Record<string, BasicPrimitive | object>;
  configs?: ArgumentConfig[];
  negative?: boolean;
  multiple?: boolean;
  valueName?: string;
  description?: string;
  describe?: string;
  negatedDescription?: string;
  defaultValue?: string;
  hidden?: boolean;
  negativeHidden?: boolean;
}

interface Env {
  WEBPACK_BUNDLE?: boolean;
  WEBPACK_BUILD?: boolean;
  WEBPACK_WATCH?: boolean;
  WEBPACK_SERVE?: boolean;
}

interface Argv extends RecordAny {
  env: Env;
}

type CallableWebpackConfiguration<T> = (env: Env, argv: Argv) => T;
type PotentialPromise<T> = T | Promise<T>;
type LoadableWebpackConfiguration = PotentialPromise<
  | Configuration
  | MultiConfiguration
  | CallableWebpackConfiguration<Configuration | MultiConfiguration>
  // TODO revisit this support in future
  | CallableWebpackConfiguration<Configuration>[]
>;

interface ConfigurationsAndPaths {
  options: Configuration | MultiConfiguration;
  path: WeakMap<object, string[]>;
}

declare interface WebpackCallback {
  (err: null | Error, result?: Stats): void;
  (err: null | Error, result?: MultiStats): void;
}

type ProcessedArguments = Parameters<(typeof webpack)["cli"]["processArguments"]>[2];
type Schema = Parameters<(typeof webpack)["cli"]["getArguments"]>[0];

interface KnownOptions {
  config?: string[];
  argv?: Argv;
  env?: Env;
  configNodeEnv?: string;
  watchOptionsStdin?: boolean;
  watch?: boolean;
  failOnWarnings?: boolean;
  isWatchingLikeCommand?: boolean;
  progress?: boolean | "profile";
  analyze?: boolean;
  json?: boolean;
  entry?: string | string[];
  merge?: boolean;
  configName?: string[];
  disableInterpret?: boolean;
  extends?: string[];
  webpack: typeof webpack;
}

type Options =
  // Webpack CLI own options
  KnownOptions &
    // Webpack and webpack-dev-server options
    RecordAny;

const DEFAULT_WEBPACK_PACKAGES: string[] = ["webpack", "loader"];

// Options that get a single-character alias derived from their name.
const FLAGS_WITH_ALIAS = new Set(["devtool", "output-path", "target", "watch", "extends"]);

// Keys the CLI sets on the parsed options itself (never webpack arguments), so
// they don't need to be forwarded to webpack's `processArguments`.
const INTERNAL_OPTION_KEYS = new Set(["webpack", "argv", "isWatchingLikeCommand"]);

// Levenshtein distance via Myers' bit-parallel algorithm, used only for "did you
// mean" suggestions. Inspired by fastest-levenshtein (MIT,
// https://github.com/ka-weihe/fastest-levenshtein).
//
// The 256 KB buffer is allocated lazily on first use: suggestions only run on
// error paths, so a normal build never pays for it.
let levenshteinPeq: Uint32Array | undefined;

function myers32(a: string, b: string, peq: Uint32Array): number {
  const n = a.length;
  const m = b.length;
  const lst = 1 << (n - 1);
  let pv = -1;
  let mv = 0;
  let sc = n;
  let i = n;

  while (i--) {
    peq[a.charCodeAt(i)] |= 1 << i;
  }

  for (i = 0; i < m; i++) {
    let eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;

    eq |= ((eq & pv) + pv) ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;

    if (mv & lst) {
      sc++;
    }

    if (pv & lst) {
      sc--;
    }

    mv = (mv << 1) | 1;
    pv = (pv << 1) | ~(xv | mv);
    mv &= xv;
  }

  i = n;

  while (i--) {
    peq[a.charCodeAt(i)] = 0;
  }

  return sc;
}

function myersX(longer: string, shorter: string, peq: Uint32Array): number {
  const n = shorter.length;
  const m = longer.length;
  const mhc: number[] = [];
  const phc: number[] = [];
  const horizontalSize = Math.ceil(n / 32);
  const verticalSize = Math.ceil(m / 32);

  for (let i = 0; i < horizontalSize; i++) {
    phc[i] = -1;
    mhc[i] = 0;
  }

  let j = 0;

  for (; j < verticalSize - 1; j++) {
    let mv = 0;
    let pv = -1;
    const start = j * 32;
    const verticalLen = Math.min(32, m) + start;

    for (let k = start; k < verticalLen; k++) {
      peq[longer.charCodeAt(k)] |= 1 << k;
    }

    for (let i = 0; i < n; i++) {
      const eq = peq[shorter.charCodeAt(i)];
      const pb = (phc[(i / 32) | 0] >>> i) & 1;
      const mb = (mhc[(i / 32) | 0] >>> i) & 1;
      const xv = eq | mv;
      const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
      let ph = mv | ~(xh | pv);
      let mh = pv & xh;

      if ((ph >>> 31) ^ pb) {
        phc[(i / 32) | 0] ^= 1 << i;
      }

      if ((mh >>> 31) ^ mb) {
        mhc[(i / 32) | 0] ^= 1 << i;
      }

      ph = (ph << 1) | pb;
      mh = (mh << 1) | mb;
      pv = mh | ~(xv | ph);
      mv = ph & xv;
    }

    for (let k = start; k < verticalLen; k++) {
      peq[longer.charCodeAt(k)] = 0;
    }
  }

  let mv = 0;
  let pv = -1;
  const start = j * 32;
  const verticalLen = Math.min(32, m - start) + start;

  for (let k = start; k < verticalLen; k++) {
    peq[longer.charCodeAt(k)] |= 1 << k;
  }

  let score = m;

  for (let i = 0; i < n; i++) {
    const eq = peq[shorter.charCodeAt(i)];
    const pb = (phc[(i / 32) | 0] >>> i) & 1;
    const mb = (mhc[(i / 32) | 0] >>> i) & 1;
    const xv = eq | mv;
    const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;

    score += (ph >>> (m - 1)) & 1;
    score -= (mh >>> (m - 1)) & 1;

    if ((ph >>> 31) ^ pb) {
      phc[(i / 32) | 0] ^= 1 << i;
    }

    if ((mh >>> 31) ^ mb) {
      mhc[(i / 32) | 0] ^= 1 << i;
    }

    ph = (ph << 1) | pb;
    mh = (mh << 1) | mb;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }

  for (let k = start; k < verticalLen; k++) {
    peq[longer.charCodeAt(k)] = 0;
  }

  return score;
}

// Levenshtein edit distance between two strings, used for "did you mean"
// suggestions. Exported only so it can be unit-tested directly; the CLI uses it
// through the private `WebpackCLI.#distance`.
export function distance(first: string, second: string): number {
  let a = first;
  let b = second;

  if (a.length < b.length) {
    const tmp = b;

    b = a;
    a = tmp;
  }

  if (b.length === 0) {
    return a.length;
  }

  levenshteinPeq ??= new Uint32Array(0x10000);

  return a.length <= 32 ? myers32(a, b, levenshteinPeq) : myersX(a, b, levenshteinPeq);
}

class ConfigurationLoadingError extends Error {
  name = "ConfigurationLoadingError";

  constructor(errors: [unknown, unknown]) {
    const message1 = errors[0] instanceof Error ? errors[0].message : String(errors[0]);
    const message2 = util.stripVTControlCharacters(
      errors[1] instanceof Error ? errors[1].message : String(errors[1]),
    );
    const message =
      `▶ ESM (\`import\`) failed:\n  ${message1.split("\n").join("\n  ")}\n\n▶ CJS (\`require\`) failed:\n  ${message2.split("\n").join("\n  ")}`.trim();

    super(message);

    this.stack = "";
  }
}

class WebpackCLI {
  #colors: Colors | undefined;

  // Created lazily because `#createColors` loads the (large) webpack package,
  // which commands like `version`/`info` don't otherwise need.
  get colors(): Colors {
    return (this.#colors ??= this.#createColors());
  }

  set colors(value: Colors) {
    this.#colors = value;
  }

  logger: Logger;

  #isColorSupportChanged: boolean | undefined;

  // Flag tokens of the current invocation, used to register only the options
  // actually present (instead of all ~850) when setting up a command.
  #argvForParsing: readonly string[] | undefined;

  program: Command;

  constructor() {
    this.logger = this.getLogger();

    // Initialize program
    this.program = program as Command;
    this.program.name("webpack");
    this.program.configureOutput({
      writeErr: (str) => {
        this.logger.error(str);
      },
      outputError: (str, write) => {
        write(`Error: ${this.capitalizeFirstLetter(str.replace(/^error:/, "").trim())}`);
      },
    });
  }

  #createColors(useColor?: boolean): Colors {
    let pkg: typeof webpack | undefined;

    try {
      pkg = require(WEBPACK_PACKAGE);
    } catch {
      // Nothing
    }

    // Some big repos can have a problem with update webpack everywhere, so let's create a simple proxy for colors
    if (!pkg || !pkg.cli || typeof pkg.cli.createColors !== "function") {
      return new Proxy({} as Colors, {
        get() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (...args: any[]) => [...args];
        },
      });
    }

    const { createColors, isColorSupported } = pkg.cli;
    const shouldUseColor = useColor || isColorSupported();

    return { ...createColors({ useColor: shouldUseColor }), isColorSupported: shouldUseColor };
  }

  isPromise<T>(value: Promise<T>): value is Promise<T> {
    return typeof (value as unknown as Promise<T>).then === "function";
  }

  isFunction(value: unknown): value is CallableFunction {
    return typeof value === "function";
  }

  capitalizeFirstLetter(str: string): string {
    return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  }

  toKebabCase(str: string): string {
    return str.replaceAll(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }

  // Levenshtein edit distance between two strings, for "did you mean" suggestions.
  static #distance(first: string, second: string): number {
    return distance(first, second);
  }

  getLogger(): Logger {
    return {
      error: (val) => console.error(`[webpack-cli] ${this.colors.red(util.format(val))}`),
      warn: (val) => console.warn(`[webpack-cli] ${this.colors.yellow(val)}`),
      info: (val) => console.info(`[webpack-cli] ${this.colors.cyan(val)}`),
      success: (val) => console.log(`[webpack-cli] ${this.colors.green(val)}`),
      log: (val) => console.log(`[webpack-cli] ${val}`),
      raw: (val) => console.log(val),
    };
  }

  async getDefaultPackageManager(): Promise<PackageManager | undefined> {
    const { sync } = await import("cross-spawn");

    try {
      await fs.promises.access(path.resolve(process.cwd(), "package-lock.json"), fs.constants.F_OK);
      return "npm";
    } catch {
      // Nothing
    }

    try {
      await fs.promises.access(path.resolve(process.cwd(), "yarn.lock"), fs.constants.F_OK);
      return "yarn";
    } catch {
      // Nothing
    }

    try {
      await fs.promises.access(path.resolve(process.cwd(), "pnpm-lock.yaml"), fs.constants.F_OK);
      return "pnpm";
    } catch {
      // Nothing
    }

    try {
      // the sync function below will fail if npm is not installed,
      // an error will be thrown
      if (sync("npm", ["--version"])) {
        return "npm";
      }
    } catch {
      // Nothing
    }

    try {
      // the sync function below will fail if yarn is not installed,
      // an error will be thrown
      if (sync("yarn", ["--version"])) {
        return "yarn";
      }
    } catch {
      // Nothing
    }

    try {
      // the sync function below will fail if pnpm is not installed,
      // an error will be thrown
      if (sync("pnpm", ["--version"])) {
        return "pnpm";
      }
    } catch {
      this.logger.error("No package manager found.");

      process.exit(2);
    }
  }

  async isPackageInstalled(packageName: string): Promise<boolean> {
    if (process.versions.pnp) {
      return true;
    }

    try {
      require.resolve(packageName);
      return true;
    } catch {
      // Nothing
    }

    // Fallback using fs
    let dir = __dirname;

    do {
      try {
        const stats = await fs.promises.stat(path.join(dir, "node_modules", packageName));

        if (stats.isDirectory()) {
          return true;
        }
      } catch {
        // Nothing
      }
    } while (dir !== (dir = path.dirname(dir)));

    // Extra fallback using fs and hidden API
    // @ts-expect-error No types, private API
    const { globalPaths } = await import("node:module");

    // https://github.com/nodejs/node/blob/v18.9.1/lib/internal/modules/cjs/loader.js#L1274
    const results = await Promise.all(
      (globalPaths as string[]).map(async (internalPath) => {
        try {
          const stats = await fs.promises.stat(path.join(internalPath, packageName));

          if (stats.isDirectory()) {
            return true;
          }
        } catch {
          // Nothing
        }

        return false;
      }),
    );

    if (results.includes(true)) {
      return true;
    }

    return false;
  }

  async installPackage(
    packageName: string,
    options: { preMessage?: () => void } = {},
  ): Promise<string> {
    const packageManager = await this.getDefaultPackageManager();

    if (!packageManager) {
      this.logger.error("Can't find package manager");

      process.exit(2);
    }

    if (options.preMessage) {
      options.preMessage();
    }

    const { createInterface } = await import("node:readline");

    const prompt = ({
      message,
      defaultResponse,
      stream,
    }: {
      message: string;
      defaultResponse: string;
      stream: NodeJS.WritableStream;
    }) => {
      const rl = createInterface({
        input: process.stdin,
        output: stream,
      });

      return new Promise((resolve) => {
        rl.question(`${message} `, (answer: string) => {
          // Close the stream
          rl.close();

          const response = (answer || defaultResponse).toLowerCase();

          // Resolve with the input response
          if (response === "y" || response === "yes") {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    };

    // yarn uses 'add' command, rest npm and pnpm both use 'install'
    const commandArguments = [packageManager === "yarn" ? "add" : "install", "-D", packageName];
    const commandToBeRun = `${packageManager} ${commandArguments.join(" ")}`;

    let needInstall;

    try {
      needInstall = await prompt({
        message: `[webpack-cli] Would you like to install '${this.colors.green(
          packageName,
        )}' package? (That will run '${this.colors.green(commandToBeRun)}') (${this.colors.yellow(
          "Y/n",
        )})`,
        defaultResponse: "Y",
        stream: process.stderr,
      });
    } catch (error) {
      this.logger.error(error);

      process.exit(error as number);
    }

    if (needInstall) {
      const { sync } = await import("cross-spawn");

      try {
        sync(packageManager, commandArguments, { stdio: "inherit" });
      } catch (error) {
        this.logger.error(error);

        process.exit(2);
      }

      return packageName;
    }

    process.exit(2);
  }

  async makeCommand<A = void, O extends CommanderArgs = CommanderArgs, C extends Context = Context>(
    options: CommandOptions<A, O, C>,
  ): Promise<Command> {
    const alreadyLoaded = this.program.commands.find(
      (command) => command.name() === options.rawName,
    );

    if (alreadyLoaded) {
      return alreadyLoaded as Command;
    }

    const command = this.program.command(options.name, {
      hidden: options.hidden,
      isDefault: options.isDefault,
    }) as Command & { context: C };

    if (options.description) {
      command.description(options.description);
    }

    if (options.usage) {
      command.usage(options.usage);
    }

    if (Array.isArray(options.alias)) {
      command.aliases(options.alias);
    } else {
      command.alias(options.alias);
    }

    command.pkg = options.pkg || "webpack-cli";

    const { forHelp } = this.program;

    let allDependenciesInstalled = true;

    if (options.dependencies && options.dependencies.length > 0) {
      for (const dependency of options.dependencies) {
        if (
          // Allow to use `./path/to/webpack.js` outside `node_modules`
          (dependency === WEBPACK_PACKAGE && WEBPACK_PACKAGE_IS_CUSTOM) ||
          // Allow to use `./path/to/webpack-dev-server.js` outside `node_modules`
          (dependency === WEBPACK_DEV_SERVER_PACKAGE && WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM)
        ) {
          continue;
        }

        const isPkgExist = await this.isPackageInstalled(dependency);

        if (isPkgExist) {
          continue;
        }

        allDependenciesInstalled = false;

        if (forHelp) {
          command.description(
            `${
              options.description
            } To see all available options you need to install ${options.dependencies
              .map((dependency) => `'${dependency}'`)
              .join(", ")}.`,
          );
          continue;
        }

        await this.installPackage(dependency, {
          preMessage: () => {
            this.logger.error(
              `For using '${this.colors.green(
                options.rawName,
              )}' command you need to install: '${this.colors.green(dependency)}' package.`,
            );
          },
        });
      }
    }

    command.context = {} as C;

    if (typeof options.preload === "function") {
      let data;

      try {
        data = await options.preload();
      } catch (err) {
        if (!forHelp) {
          throw err;
        }
      }

      command.context = { ...command.context, ...data };
    }

    if (options.options) {
      // Register every option for help, otherwise only the ones present in argv.
      const neededOptions = forHelp ? undefined : this.#neededOptionNames();

      // With no option flags in argv (e.g. a plain `webpack build`), nothing
      // needs to be registered and no unknown-option suggestions are possible,
      // so skip building the (large) option list entirely. This avoids the
      // schema-to-arguments walk on the most common invocation.
      if (!neededOptions || neededOptions.size > 0) {
        let commandOptions: CommandOption[];

        if (
          forHelp &&
          !allDependenciesInstalled &&
          options.dependencies &&
          options.dependencies.length > 0
        ) {
          commandOptions = [];
        } else if (typeof options.options === "function") {
          commandOptions = await options.options(command);
        } else {
          commandOptions = options.options;
        }

        // Keep all option names (including `no-` negated forms) for "did you mean" suggestions, since not every option is registered below.
        const allOptionNames: string[] = [];

        for (const option of commandOptions) {
          allOptionNames.push(option.name);

          if (this.#optionSupportsNegation(option)) {
            allOptionNames.push(`no-${option.name}`);
          }
        }

        (command as Command & { allOptionNames?: string[] }).allOptionNames = allOptionNames;

        for (const option of commandOptions) {
          if (neededOptions && !this.#isOptionNeeded(option, neededOptions)) {
            continue;
          }

          this.makeOption(command, option);
        }
      }
    }

    command.action(options.action);

    return command;
  }

  #neededOptionNames(): Set<string> | undefined {
    const argv = this.#argvForParsing;

    if (!argv) {
      return undefined;
    }

    const names = new Set<string>();

    for (const token of argv) {
      // Must start with `-` to name an option.
      if (token.length < 2 || token.charCodeAt(0) !== 45) {
        continue;
      }

      if (token.charCodeAt(1) === 45) {
        // Long option: `--name` or `--name=value`.
        let name = token.slice(2);
        const equalsIndex = name.indexOf("=");

        if (equalsIndex !== -1) {
          name = name.slice(0, equalsIndex);
        }

        if (!name) {
          continue;
        }

        names.add(name);

        // `--no-x` must register the `x` option (which provides the negation).
        if (name.startsWith("no-")) {
          names.add(name.slice(3));
        }
      } else {
        // Register every letter of a short token to cover both attached values (`-d<value>`) and combined flags (`-abc`); over-registering is harmless.
        for (const char of token.slice(1).split("=", 1)[0]) {
          names.add(char);
        }
      }
    }

    return names;
  }

  #isOptionNeeded(option: CommandOption, neededOptions: Set<string>): boolean {
    if (neededOptions.has(option.name)) {
      return true;
    }

    // `makeOption` derives a single-character alias for these from the name.
    const alias = option.alias ?? (FLAGS_WITH_ALIAS.has(option.name) ? option.name[0] : undefined);

    return typeof alias === "string" && neededOptions.has(alias);
  }

  // Mirrors when `makeOption` registers a `--no-<name>` negated option.
  #optionSupportsNegation(option: CommandOption): boolean {
    if (option.configs) {
      return option.configs.some(
        (config) =>
          config.type === "boolean" ||
          (config.type === "enum" && (config.values || []).includes(false)),
      );
    }

    return Boolean(option.negative);
  }

  makeOption(command: Command, option: CommandOption) {
    type MainOption = Pick<
      CommandOption,
      "valueName" | "description" | "defaultValue" | "multiple" | "configs"
    > & {
      flags: string;
      type: Set<BooleanConstructor | StringConstructor | NumberConstructor>;
    };
    type NegativeOption = Pick<
      CommandOption,
      "valueName" | "description" | "defaultValue" | "multiple"
    > & {
      flags: string;
    };
    let mainOption: MainOption;
    let negativeOption: NegativeOption | undefined;

    if (FLAGS_WITH_ALIAS.has(option.name)) {
      [option.alias] = option.name;
    }

    if (option.configs) {
      let needNegativeOption = false;
      let negatedDescription;
      const mainOptionType: MainOption["type"] = new Set();

      for (const config of option.configs) {
        switch (config.type) {
          case "reset":
            mainOptionType.add(Boolean);
            break;
          case "boolean":
            if (!needNegativeOption) {
              needNegativeOption = true;
              negatedDescription = config.negatedDescription;
            }

            mainOptionType.add(Boolean);
            break;
          case "number":
            mainOptionType.add(Number);
            break;
          case "string":
          case "path":
          case "RegExp":
            mainOptionType.add(String);
            break;
          case "enum": {
            let hasFalseEnum = false;

            for (const value of config.values || []) {
              switch (typeof value) {
                case "string":
                  mainOptionType.add(String);
                  break;
                case "number":
                  mainOptionType.add(Number);
                  break;
                case "boolean":
                  if (!hasFalseEnum && value === false) {
                    hasFalseEnum = true;
                    break;
                  }

                  mainOptionType.add(Boolean);
                  break;
              }
            }

            if (!needNegativeOption) {
              needNegativeOption = hasFalseEnum;
              negatedDescription = config.negatedDescription;
            }
          }
        }
      }

      mainOption = {
        flags: option.alias ? `-${option.alias}, --${option.name}` : `--${option.name}`,
        valueName: option.valueName || "value",
        description: option.description || "",
        type: mainOptionType,
        multiple: option.multiple,
        defaultValue: option.defaultValue,
        configs: option.configs,
      };

      if (needNegativeOption) {
        negativeOption = {
          flags: `--no-${option.name}`,
          description:
            negatedDescription || option.negatedDescription || `Negative '${option.name}' option.`,
        };
      }
    } else {
      mainOption = {
        flags: option.alias ? `-${option.alias}, --${option.name}` : `--${option.name}`,
        valueName: option.valueName || "value",
        description: option.description || "",
        type: option.type
          ? new Set(Array.isArray(option.type) ? option.type : [option.type])
          : new Set([Boolean]),
        multiple: option.multiple,
        defaultValue: option.defaultValue,
      };

      if (option.negative) {
        negativeOption = {
          flags: `--no-${option.name}`,
          description: option.negatedDescription || `Negative '${option.name}' option.`,
        };
      }
    }

    if (mainOption.type.size > 1 && mainOption.type.has(Boolean)) {
      mainOption.flags = `${mainOption.flags} [${mainOption.valueName}${
        mainOption.multiple ? "..." : ""
      }]`;
    } else if (mainOption.type.size > 0 && !mainOption.type.has(Boolean)) {
      mainOption.flags = `${mainOption.flags} <${mainOption.valueName}${
        mainOption.multiple ? "..." : ""
      }>`;
    }

    if (mainOption.type.size === 1) {
      if (mainOption.type.has(Number)) {
        let skipDefault = true;

        const optionForCommand = new Option(mainOption.flags, mainOption.description)
          .argParser((value: string, prev: number | number[] = []) => {
            if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
              prev = [];
              skipDefault = false;
            }

            return mainOption.multiple ? [...(prev as number[]), Number(value)] : Number(value);
          })
          .default(mainOption.defaultValue);

        optionForCommand.hidden = option.hidden || false;

        command.addOption(optionForCommand);
      } else if (mainOption.type.has(String)) {
        let skipDefault = true;

        const optionForCommand = new Option(mainOption.flags, mainOption.description)
          .argParser((value: string, prev: string | string[] = []) => {
            if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
              prev = [];
              skipDefault = false;
            }

            return mainOption.multiple ? [...(prev as string[]), value] : value;
          })
          .default(mainOption.defaultValue);

        optionForCommand.hidden = option.hidden || false;

        if (option.configs) {
          (optionForCommand as Option & { configs: ArgumentConfig[] }).configs = option.configs;
        }

        command.addOption(optionForCommand);
      } else if (mainOption.type.has(Boolean)) {
        const optionForCommand = new Option(mainOption.flags, mainOption.description).default(
          mainOption.defaultValue,
        );

        optionForCommand.hidden = option.hidden || false;

        command.addOption(optionForCommand);
      } else {
        const optionForCommand = new Option(mainOption.flags, mainOption.description)
          .argParser([...mainOption.type][0] as (value: string, previous: unknown) => unknown)
          .default(mainOption.defaultValue);

        optionForCommand.hidden = option.hidden || false;

        command.addOption(optionForCommand);
      }
    } else if (mainOption.type.size > 1) {
      let skipDefault = true;

      const optionForCommand = new Option(mainOption.flags, mainOption.description)
        .argParser((value: string, prev: number | string | number[] | string[] = []) => {
          if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
            prev = [];
            skipDefault = false;
          }

          if (mainOption.type.has(Number)) {
            const numberValue = Number(value);

            if (!Number.isNaN(numberValue)) {
              return mainOption.multiple ? [...(prev as number[]), numberValue] : numberValue;
            }
          }

          if (mainOption.type.has(String)) {
            return mainOption.multiple ? [...(prev as string[]), value] : value;
          }

          return value;
        })
        .default(mainOption.defaultValue);

      optionForCommand.hidden = option.hidden || false;

      if (option.configs) {
        (optionForCommand as Option & { configs: ArgumentConfig[] }).configs = option.configs;
      }

      command.addOption(optionForCommand);
    } else if (mainOption.type.size === 0 && negativeOption) {
      const optionForCommand = new Option(mainOption.flags, mainOption.description);

      // Hide stub option
      // TODO find a solution to hide such options in the new commander version, for example `--performance` and `--no-performance` because we don't have `--performance` at all
      optionForCommand.hidden = option.hidden || true;
      (optionForCommand as Option & { internal?: boolean }).internal = true;

      command.addOption(optionForCommand);
    }

    if (negativeOption) {
      const optionForCommand = new Option(negativeOption.flags, negativeOption.description).default(
        false,
      );

      optionForCommand.hidden = option.hidden || option.negativeHidden || false;

      command.addOption(optionForCommand);
    }
  }

  isMultipleConfiguration(
    config: Configuration | MultiConfiguration,
  ): config is MultiConfiguration {
    return Array.isArray(config);
  }

  isMultipleCompiler(compiler: Compiler | MultiCompiler): compiler is MultiCompiler {
    return (compiler as MultiCompiler).compilers as unknown as boolean;
  }

  isValidationError(error: unknown): error is WebpackError {
    return (error as Error).name === "ValidationError";
  }

  // Cache the expensive schema-to-arguments walk per webpack module and schema, held via `WeakRef` so the GC can reclaim the ~1MB result after command setup (a miss simply rebuilds it).
  #argumentsCache = new WeakMap<
    object,
    Map<Schema, WeakRef<ReturnType<(typeof webpack)["cli"]["getArguments"]>>>
  >();

  #getArguments(webpackMod: typeof webpack, schema: Schema) {
    let perModuleCache = this.#argumentsCache.get(webpackMod);

    if (!perModuleCache) {
      perModuleCache = new Map();
      this.#argumentsCache.set(webpackMod, perModuleCache);
    }

    let args = perModuleCache.get(schema)?.deref();

    if (!args) {
      args = webpackMod.cli.getArguments(schema);
      perModuleCache.set(schema, new WeakRef(args));
    }

    return args;
  }

  schemaToOptions(
    webpackMod: typeof webpack,
    schema: Schema = undefined,
    additionalOptions: CommandOption[] = [],
    override: Partial<CommandOption> = {},
  ): CommandOption[] {
    const args = this.#getArguments(webpackMod, schema);
    // Take memory
    const options: CommandOption[] = Array.from({
      length: additionalOptions.length + Object.keys(args).length,
    });

    let i = 0;
    // Adding own options
    for (; i < additionalOptions.length; i++) options[i] = additionalOptions[i];

    // Adding core options
    for (const name in args) {
      const meta = args[name];
      options[i++] = {
        ...meta,
        name,
        description: meta.description,
        hidden: !this.#minimumHelpOptions.has(name),
        negativeHidden: !this.#minimumNegativeHelpOptions.has(name),
        ...override,
      };
    }

    return options;
  }

  #processArguments(
    webpackMod: typeof webpack,
    args: Record<string, WebpackArgument>,
    configuration: RecordAny,
    values: ProcessedArguments,
  ) {
    const problems = webpackMod.cli.processArguments(args, configuration, values);

    if (problems) {
      const groupBy = <K extends keyof Problem & StringsKeys<Problem>>(xs: Problem[], key: K) =>
        xs.reduce(
          (rv, problem) => {
            const path = problem[key];

            (rv[path] ||= []).push(problem);

            return rv;
          },
          {} as Record<string, Problem[]>,
        );
      const problemsByPath = groupBy<"path">(problems, "path");

      for (const path in problemsByPath) {
        const problems = problemsByPath[path];

        for (const problem of problems) {
          this.logger.error(
            `${this.capitalizeFirstLetter(problem.type.replaceAll("-", " "))}${
              problem.value ? ` '${problem.value}'` : ""
            } for the '--${problem.argument.replaceAll(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}' option${
              problem.index ? ` by index '${problem.index}'` : ""
            }`,
          );

          if (problem.expected) {
            if (problem.expected === "true | false") {
              this.logger.error("Expected: without value or negative option");
            } else {
              this.logger.error(`Expected: '${problem.expected}'`);
            }
          }
        }
      }

      process.exit(2);
    }
  }

  async #outputHelp(
    options: string[],
    isVerbose: boolean,
    isHelpCommandSyntax: boolean,
    program: Command,
  ) {
    const isOption = (value: string): boolean => value.startsWith("-");
    const isGlobalOption = (value: string) =>
      value === "--color" ||
      value === "--no-color" ||
      value === "-v" ||
      value === "--version" ||
      value === "-h" ||
      value === "--help";
    const { bold } = this.colors;
    const outputIncorrectUsageOfHelp = () => {
      this.logger.error("Incorrect use of help");
      this.logger.error(
        "Please use: 'webpack help [command] [option]' | 'webpack [command] --help'",
      );
      this.logger.error("Run 'webpack --help' to see available commands and options");
      process.exit(2);
    };

    const isGlobalHelp = options.length === 0;
    const isCommandHelp = options.length === 1 && !isOption(options[0]);

    if (isGlobalHelp || isCommandHelp) {
      program.configureHelp({
        helpWidth:
          typeof process.env.WEBPACK_CLI_HELP_WIDTH !== "undefined"
            ? Number.parseInt(process.env.WEBPACK_CLI_HELP_WIDTH, 10)
            : 40,
        sortSubcommands: true,
        // Support multiple aliases
        commandUsage: (command) => {
          let parentCmdNames = "";

          for (let parentCmd = command.parent; parentCmd; parentCmd = parentCmd.parent) {
            parentCmdNames = `${parentCmd.name()} ${parentCmdNames}`;
          }

          if (isGlobalHelp) {
            return `${parentCmdNames}${command.usage()}\n${bold(
              "Alternative usage to run commands:",
            )} ${parentCmdNames}[command] [options]`;
          }

          return `${parentCmdNames}${command.name()}|${command
            .aliases()
            .join("|")} ${command.usage()}`;
        },
        // Support multiple aliases
        subcommandTerm: (command) => {
          const usage = command.usage();
          return `${command.name()}|${command.aliases().join("|")}${usage.length > 0 ? ` ${usage}` : ""}`;
        },
        visibleOptions: function visibleOptions(command) {
          return command.options.filter((option) => {
            if ((option as Option & { internal?: boolean }).internal) {
              return false;
            }

            // Hide `--watch` option when developer use `webpack watch --help`
            if (
              (options[0] === "w" || options[0] === "watch") &&
              (option.name() === "watch" || option.name() === "no-watch")
            ) {
              return false;
            }

            if (option.hidden) {
              return isVerbose;
            }

            return true;
          });
        },
        padWidth(command, helper: Help) {
          return Math.max(
            helper.longestArgumentTermLength(command, helper),
            helper.longestOptionTermLength(command, helper),
            // For global options
            helper.longestOptionTermLength(program, helper),
            helper.longestSubcommandTermLength(isGlobalHelp ? program : command, helper),
          );
        },
        formatHelp: (command, helper: Help) => {
          const formatItem = (term: string, description: string) => {
            if (description) {
              return helper.formatItem(term, helper.padWidth(command, helper), description, helper);
            }

            return term;
          };

          const formatList = (textArray: string[]) => textArray.join("\n").replaceAll(/^/gm, "");

          // Usage
          let output = [`${bold("Usage:")} ${helper.commandUsage(command)}`, ""];

          // Description
          const commandDescription = isGlobalHelp
            ? "The build tool for modern web applications."
            : helper.commandDescription(command);

          if (commandDescription.length > 0) {
            output = [...output, commandDescription, ""];
          }

          // Arguments
          const argumentList = helper
            .visibleArguments(command)
            .map((argument) => formatItem(argument.name(), argument.description));

          if (argumentList.length > 0) {
            output = [...output, bold("Arguments:"), formatList(argumentList), ""];
          }

          // Options
          const optionList = helper
            .visibleOptions(command)
            .map((option) =>
              formatItem(helper.optionTerm(option), helper.optionDescription(option)),
            );

          if (optionList.length > 0) {
            output = [...output, bold("Options:"), formatList(optionList), ""];
          }

          // Global options
          const globalOptionList = program.options.map((option) =>
            formatItem(helper.optionTerm(option), helper.optionDescription(option)),
          );

          if (globalOptionList.length > 0) {
            output = [...output, bold("Global options:"), formatList(globalOptionList), ""];
          }

          // Commands
          const commandList = helper
            .visibleCommands(isGlobalHelp ? program : command)
            .map((command) =>
              formatItem(helper.subcommandTerm(command), helper.subcommandDescription(command)),
            );

          if (commandList.length > 0) {
            output = [...output, bold("Commands:"), formatList(commandList), ""];
          }

          return output.join("\n");
        },
      });

      if (isGlobalHelp) {
        await Promise.all(
          Object.values(this.#commands).map((knownCommand) =>
            this.#loadCommandByName(knownCommand.rawName),
          ),
        );

        const buildCommand = this.#findCommandByName(this.#commands.build.rawName);

        if (buildCommand) {
          this.logger.raw(buildCommand.helpInformation());
        }
      } else {
        const [name] = options;

        const command = await this.#loadCommandByName(name);

        if (!command) {
          this.logger.error(`Can't find and load command '${name}'`);
          this.logger.error("Run 'webpack --help' to see available commands and options.");
          process.exit(2);
        }

        this.logger.raw(command.helpInformation());
      }
    } else if (isHelpCommandSyntax) {
      let isCommandSpecified = false;
      let commandName = this.#commands.build.rawName;
      let optionName = "";

      if (options.length === 1) {
        [optionName] = options;
      } else if (options.length === 2) {
        isCommandSpecified = true;
        [commandName, optionName] = options;

        if (isOption(commandName)) {
          outputIncorrectUsageOfHelp();
        }
      } else {
        outputIncorrectUsageOfHelp();
      }

      const command = isGlobalOption(optionName)
        ? program
        : await this.#loadCommandByName(commandName);

      if (!command) {
        this.logger.error(`Can't find and load command '${commandName}'`);
        this.logger.error("Run 'webpack --help' to see available commands and options");
        process.exit(2);
      }

      const option = command.options.find(
        (option) => option.short === optionName || option.long === optionName,
      );

      if (!option) {
        this.logger.error(`Unknown option '${optionName}'`);
        this.logger.error("Run 'webpack --help' to see available commands and options");
        process.exit(2);
        return;
      }

      const nameOutput =
        option.flags.replace(/^.+[[<]/, "").replace(/(\.\.\.)?[\]>].*$/, "") +
        (option.variadic === true ? "..." : "");
      const value = option.required ? `<${nameOutput}>` : option.optional ? `[${nameOutput}]` : "";

      this.logger.raw(
        `${bold("Usage")}: webpack${isCommandSpecified ? ` ${commandName}` : ""} ${option.long}${
          value ? ` ${value}` : ""
        }`,
      );

      if (option.short) {
        this.logger.raw(
          `${bold("Short:")} webpack${isCommandSpecified ? ` ${commandName}` : ""} ${
            option.short
          }${value ? ` ${value}` : ""}`,
        );
      }

      if (option.description) {
        this.logger.raw(`${bold("Description:")} ${option.description}`);
      }

      const { configs } = option as Option & { configs?: ArgumentConfig[] };

      if (configs) {
        const possibleValues = configs.reduce((accumulator, currentValue) => {
          if (currentValue.values) {
            return [...accumulator, ...currentValue.values];
          }

          return accumulator;
        }, [] as EnumValue[]);

        if (possibleValues.length > 0) {
          // Convert the possible values to a union type string
          // ['mode', 'development', 'production'] => "'mode' | 'development' | 'production'"
          // [false, 'eval'] => "false | 'eval'"
          const possibleValuesUnionTypeString = possibleValues
            .map((value) => (typeof value === "string" ? `'${value}'` : value))
            .join(" | ");

          this.logger.raw(`${bold("Possible values:")} ${possibleValuesUnionTypeString}`);
        }
      }

      this.logger.raw("");

      // TODO implement this after refactor cli arguments
      // logger.raw('Documentation: https://webpack.js.org/option/name/');
    } else {
      outputIncorrectUsageOfHelp();
    }

    this.logger.raw(
      "To see list of all supported commands and options run 'webpack --help=verbose'.\n",
    );
    this.logger.raw(`${bold("Webpack documentation:")} https://webpack.js.org/.`);
    this.logger.raw(`${bold("CLI documentation:")} https://webpack.js.org/api/cli/.`);
    this.logger.raw(`${bold("Made with ♥ by the webpack team")}.`);
    process.exit(0);
  }

  async #renderVersion(options: { output?: string } = {}): Promise<string> {
    let info = await this.#getInfoOutput({
      ...options,
      information: {
        npmPackages: `{${DEFAULT_WEBPACK_PACKAGES.map((item) => `*${item}*`).join(",")}}`,
      },
    });

    if (typeof options.output === "undefined") {
      info = info.replace("Packages:", "").replaceAll(/^\s+/gm, "").trim();
    }

    return info;
  }

  async #getInfoOutput(options: {
    output?: string;
    additionalPackage?: string[];
    information?: EnvinfoConfig;
  }): Promise<string> {
    let { output } = options;
    const envinfoConfig: EnvinfoOptions = {};

    if (output) {
      // Remove quotes if exist
      output = output.replaceAll(/['"]+/g, "");

      switch (output) {
        case "markdown":
          envinfoConfig.markdown = true;
          break;
        case "json":
          envinfoConfig.json = true;
          break;
        default:
          this.logger.error(`'${output}' is not a valid value for output`);
          process.exit(2);
      }
    }

    let envinfoOptions: EnvinfoConfig;

    if (options.information) {
      envinfoOptions = options.information;
    } else {
      const defaultInformation: EnvinfoConfig = {
        Binaries: ["Node", "Yarn", "npm", "pnpm"],
        Browsers: [
          "Brave Browser",
          "Chrome",
          "Chrome Canary",
          "Edge",
          "Firefox",
          "Firefox Developer Edition",
          "Firefox Nightly",
          "Internet Explorer",
          "Safari",
          "Safari Technology Preview",
        ],
        // @ts-expect-error No in types
        Monorepos: ["Yarn Workspaces", "Lerna"],
        System: ["OS", "CPU", "Memory"],
        npmGlobalPackages: ["webpack", "webpack-cli", "webpack-dev-server"],
      };

      const npmPackages = [...DEFAULT_WEBPACK_PACKAGES, ...(options.additionalPackage || [])];

      defaultInformation.npmPackages = `{${npmPackages.map((item) => `*${item}*`).join(",")}}`;

      envinfoOptions = defaultInformation;
    }

    const envinfo = (await import("envinfo")).default;

    let info = await envinfo.run(envinfoOptions, envinfoConfig);

    info = info.replace("npmPackages", "Packages");
    info = info.replace("npmGlobalPackages", "Global Packages");

    return info;
  }

  async #loadPackage<T>(pkg: string, isCustom: boolean): Promise<T> {
    const importTarget =
      isCustom && /^(?:[A-Za-z]:(\\|\/)|\\\\|\/)/.test(pkg) ? pathToFileURL(pkg).toString() : pkg;

    return (await import(importTarget)).default;
  }

  async loadWebpack(): Promise<typeof webpack> {
    return this.#loadPackage(WEBPACK_PACKAGE, WEBPACK_PACKAGE_IS_CUSTOM);
  }

  async loadWebpackDevServer(): Promise<typeof import("webpack-dev-server")> {
    return this.#loadPackage(WEBPACK_DEV_SERVER_PACKAGE, WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM);
  }

  #minimumHelpOptions = new Set([
    "mode",
    "watch",
    "watch-options-stdin",
    "stats",
    "devtool",
    "entry",
    "target",
    "name",
    "output-path",
    "extends",
  ]);

  #minimumNegativeHelpOptions = new Set(["devtool"]);

  #CLIOptions: CommandOption[] = [
    // For configs
    {
      name: "config",
      alias: "c",
      configs: [
        {
          type: "string",
        },
      ],
      multiple: true,
      valueName: "pathToConfigFile",
      description:
        'Provide path to one or more webpack configuration files to process, e.g. "./webpack.config.js".',
      hidden: false,
    },
    {
      name: "config-name",
      configs: [
        {
          type: "string",
        },
      ],
      multiple: true,
      valueName: "name",
      description:
        "Name(s) of particular configuration(s) to use if configuration file exports an array of multiple configurations.",
      hidden: false,
    },
    {
      name: "merge",
      alias: "m",
      configs: [
        {
          type: "enum",
          values: [true],
        },
      ],
      description: "Merge two or more configurations using 'webpack-merge'.",
      hidden: false,
    },
    // Complex configs
    {
      name: "env",
      type: (
        value: string,
        previous: Record<string, BasicPrimitive | object> = {},
      ): Record<string, BasicPrimitive | object> => {
        // This ensures we're only splitting by the first `=`
        const [allKeys, val] = value.split(/[=](.+)/, 2);
        const splitKeys = allKeys.split(/\.(?!$)/);

        let prevRef = previous;

        for (let [index, someKey] of splitKeys.entries()) {
          // https://github.com/webpack/webpack-cli/issues/3284
          if (someKey.endsWith("=")) {
            // remove '=' from key
            someKey = someKey.slice(0, -1);
            // @ts-expect-error we explicitly want to set it to undefined
            prevRef[someKey] = undefined;
            continue;
          }

          if (!prevRef[someKey]) {
            prevRef[someKey] = {};
          }

          if (typeof prevRef[someKey] === "string") {
            prevRef[someKey] = {};
          }

          if (index === splitKeys.length - 1) {
            prevRef[someKey] = typeof val === "string" ? val : true;
          }

          prevRef = prevRef[someKey] as Record<string, string | object | boolean>;
        }

        return previous;
      },
      multiple: true,
      description:
        'Environment variables passed to the configuration when it is a function, e.g. "myvar" or "myvar=myval".',
      hidden: false,
    },
    {
      name: "config-node-env",
      configs: [
        {
          type: "string",
        },
      ],
      multiple: false,
      description:
        "Sets process.env.NODE_ENV to the specified value for access within the configuration.",
      hidden: false,
    },

    // Adding more plugins
    {
      name: "analyze",
      configs: [
        {
          type: "enum",
          values: [true],
        },
      ],
      multiple: false,
      description: "It invokes webpack-bundle-analyzer plugin to get bundle information.",
      hidden: false,
    },
    {
      name: "progress",
      configs: [
        {
          type: "string",
        },
        {
          type: "enum",
          values: [true],
        },
      ],
      description: "Print compilation progress during build.",
      hidden: false,
    },

    // Output options
    {
      name: "json",
      configs: [
        {
          type: "string",
        },
        {
          type: "enum",
          values: [true],
        },
      ],
      alias: "j",
      valueName: "pathToJsonFile",
      description: "Prints result as JSON or store it in a file.",
      hidden: false,
    },
    {
      name: "fail-on-warnings",
      configs: [
        {
          type: "enum",
          values: [true],
        },
      ],
      description: "Stop webpack-cli process with non-zero exit code on warnings from webpack.",
      hidden: false,
    },
    {
      name: "disable-interpret",
      configs: [
        {
          type: "enum",
          values: [true],
        },
      ],
      description: "Disable interpret for loading the config file.",
      hidden: false,
    },
  ];

  #commands: KnownWebpackCLICommands = {
    build: {
      rawName: "build",
      name: "build [entries...]",
      alias: ["bundle", "b"],
      description: "Run webpack (default command, can be omitted).",
      usage: "[entries...] [options]",
      dependencies: [WEBPACK_PACKAGE],
      preload: async () => {
        const webpack = await this.loadWebpack();
        return { webpack };
      },
      options: async (cmd) =>
        this.schemaToOptions(cmd.context.webpack, undefined, this.#CLIOptions),
      action: async (entries, options, cmd) => {
        const { webpack } = cmd.context;

        if (entries.length > 0) {
          options.entry = [...entries, ...(options.entry || [])];
        }

        options.webpack = webpack;

        await this.runWebpack(options as Options, false);
      },
    },
    watch: {
      rawName: "watch",
      name: "watch [entries...]",
      alias: "w",
      description: "Run webpack and watch for files changes.",
      usage: "[entries...] [options]",
      dependencies: [WEBPACK_PACKAGE],
      preload: async () => {
        const webpack = await this.loadWebpack();
        return { webpack };
      },
      options: async (cmd) =>
        this.schemaToOptions(cmd.context.webpack, undefined, this.#CLIOptions),
      action: async (entries, options, cmd) => {
        const { webpack } = cmd.context;

        if (entries.length > 0) {
          options.entry = [...entries, ...(options.entry || [])];
        }

        options.webpack = webpack;

        await this.runWebpack(options as Options, true);
      },
    },
    serve: {
      rawName: "serve",
      name: "serve [entries...]",
      alias: ["server", "s"],
      description: "Run the webpack dev server and watch for source file changes while serving.",
      usage: "[entries...] [options]",
      dependencies: [WEBPACK_PACKAGE, WEBPACK_DEV_SERVER_PACKAGE],
      preload: async () => {
        const webpack = await this.loadWebpack();
        const devServer = await this.loadWebpackDevServer();

        return { webpack, devServer };
      },
      options: (cmd) => {
        const { webpack, devServer } = cmd.context;
        const webpackOptions = this.schemaToOptions(webpack, undefined, this.#CLIOptions);
        // @ts-expect-error different versions of the `Schema` type
        const devServerOptions = this.schemaToOptions(webpack, devServer.schema, undefined, {
          hidden: false,
          negativeHidden: false,
        });

        return [...webpackOptions, ...devServerOptions];
      },
      action: async (entries: string[], options: CommanderArgs, cmd) => {
        const { webpack, devServer } = cmd.context;
        const webpackCLIOptions: Options = { webpack, isWatchingLikeCommand: true };
        const devServerCLIOptions: CommanderArgs = {};
        // Derive the built-in option names from the cached argument metadata
        // instead of retaining the full option arrays for the whole session.
        const webpackOptionNames = new Set([
          ...this.#CLIOptions.map((option) => option.name),
          ...Object.keys(this.#getArguments(webpack, undefined)),
        ]);

        for (const optionName in options) {
          const kebabedOption = this.toKebabCase(optionName);
          const isBuiltInOption = webpackOptionNames.has(kebabedOption);

          if (isBuiltInOption) {
            webpackCLIOptions[optionName as keyof Options] = options[optionName];
          } else {
            devServerCLIOptions[optionName] = options[optionName];
          }
        }

        if (entries.length > 0) {
          webpackCLIOptions.entry = [...entries, ...(options.entry || [])];
        }

        webpackCLIOptions.argv = {
          ...options,
          env: { WEBPACK_SERVE: true, ...options.env },
        };

        const compiler = await this.createCompiler(webpackCLIOptions);

        if (!compiler) {
          return;
        }

        type DevServerConstructor = typeof import("webpack-dev-server");

        const DevServer: DevServerConstructor = cmd.context.devServer;
        const servers: InstanceType<DevServerConstructor>[] = [];

        if (this.#needWatchStdin(compiler)) {
          process.stdin.on("end", () => {
            Promise.all(servers.map((server) => server.stop())).then(() => {
              process.exit(0);
            });
          });
          process.stdin.resume();
        }

        const compilers = this.isMultipleCompiler(compiler) ? compiler.compilers : [compiler];
        const possibleCompilers = compilers.filter((compiler) => compiler.options.devServer);
        const compilersForDevServer =
          possibleCompilers.length > 0 ? possibleCompilers : [compilers[0]];
        const usedPorts: number[] = [];
        // @ts-expect-error different versions of the `Schema` type
        const devServerArgs = this.#getArguments(webpack, devServer.schema);

        for (const compilerForDevServer of compilersForDevServer) {
          if (compilerForDevServer.options.devServer === false) {
            continue;
          }

          const devServerConfiguration: DevServerConfiguration =
            compilerForDevServer.options.devServer || {};

          const args: Record<string, WebpackArgument> = {};
          const values: ProcessedArguments = {};

          for (const name of Object.keys(options)) {
            if (name === "argv") continue;

            const kebabName = this.toKebabCase(name);
            const arg = devServerArgs[kebabName];

            if (arg) {
              args[name] = arg;
              // We really don't know what the value is
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              values[name] = options[name as keyof Options] as any;
            }
          }

          if (Object.keys(values).length > 0) {
            this.#processArguments(webpack, args, devServerConfiguration, values);
          }

          if (devServerConfiguration.port) {
            const portNumber = Number(devServerConfiguration.port);

            if (usedPorts.includes(portNumber)) {
              throw new Error(
                "Unique ports must be specified for each devServer option in your webpack configuration. Alternatively, run only 1 devServer config using the --config-name flag to specify your desired config.",
              );
            }

            usedPorts.push(portNumber);
          }

          try {
            const server = new DevServer(devServerConfiguration, compiler);

            await server.start();

            servers.push(server as unknown as InstanceType<DevServerConstructor>);
          } catch (error) {
            if (this.isValidationError(error as Error)) {
              this.logger.error((error as Error).message);
            } else {
              this.logger.error(error);
            }

            process.exit(2);
          }
        }

        if (servers.length === 0) {
          this.logger.error("No dev server configurations to run");
          process.exit(2);
        }
      },
    },
    help: {
      rawName: "help",
      name: "help [command] [option]",
      alias: "h",
      description: "Display help for commands and options.",
      action: () => {
        // Nothing, just stub
      },
    },
    version: {
      rawName: "version",
      name: "version",
      alias: "v",
      usage: "[options]",
      description:
        "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and other packages.",
      options: [
        {
          name: "output",
          alias: "o",
          configs: [
            {
              type: "string",
            },
          ],
          description: "To get the output in a specified format (accept json or markdown)",
          hidden: false,
        },
      ],
      action: async (options: { output?: string }) => {
        const info = await this.#renderVersion(options);

        this.logger.raw(info);
      },
    },
    info: {
      rawName: "info",
      name: "info",
      alias: "i",
      usage: "[options]",
      description: "Outputs information about your system.",
      options: [
        {
          name: "output",
          alias: "o",
          configs: [
            {
              type: "string",
            },
          ],
          description: "To get the output in a specified format (accept json or markdown)",
          hidden: false,
        },
        {
          name: "additional-package",
          alias: "a",
          configs: [{ type: "string" }],
          multiple: true,
          description: "Adds additional packages to the output",
          hidden: false,
        },
      ],
      action: async (options: { output?: string; additionalPackage?: string[] }) => {
        const info = await this.#getInfoOutput(options);

        this.logger.raw(info);
      },
    },
    configtest: {
      rawName: "configtest",
      name: "configtest [config-path]",
      alias: "t",
      description: "Validate a webpack configuration.",
      dependencies: [WEBPACK_PACKAGE],
      options: [],
      preload: async () => {
        const webpack = await this.loadWebpack();
        return { webpack };
      },
      action: async (configPath: string | undefined, _options: CommanderArgs, cmd) => {
        const { webpack } = cmd.context;
        const env: Env = {};
        const argv: Argv = { env };
        const config = await this.loadConfig(
          configPath ? { env, argv, webpack, config: [configPath] } : { env, argv, webpack },
        );
        const configPaths = new Set<string>();

        if (Array.isArray(config.options)) {
          for (const options of config.options) {
            const loadedConfigPaths = config.path.get(options);

            if (loadedConfigPaths) {
              for (const path of loadedConfigPaths) configPaths.add(path);
            }
          }
        } else if (config.path.get(config.options)) {
          const loadedConfigPaths = config.path.get(config.options);

          if (loadedConfigPaths) {
            for (const path of loadedConfigPaths) configPaths.add(path);
          }
        }

        if (configPaths.size === 0) {
          this.logger.error("No configuration found.");
          process.exit(2);
        }

        this.logger.info(`Validate '${[...configPaths].join(" ,")}'.`);

        try {
          cmd.context.webpack.validate(config.options);
        } catch (error) {
          if (this.isValidationError(error as Error)) {
            this.logger.error((error as Error).message);
          } else {
            this.logger.error(error);
          }

          process.exit(2);
        }

        this.logger.success("There are no validation errors in the given webpack configuration.");
      },
    },
  };

  #isCommand<A = void, O extends CommanderArgs = CommanderArgs, C extends Context = Context>(
    input: string,
    commandOptions: CommandOptions<A, O, C>,
  ) {
    const longName = commandOptions.rawName;

    if (input === longName) {
      return true;
    }

    if (commandOptions.alias) {
      if (Array.isArray(commandOptions.alias)) {
        return commandOptions.alias.includes(input);
      }
      return commandOptions.alias === input;
    }

    return false;
  }

  #findCommandByName(name: string) {
    return this.program.commands.find(
      (command) => name === command.name() || command.aliases().includes(name),
    );
  }

  async #loadCommandByName(commandName: string): Promise<Command | undefined> {
    if (this.#isCommand(commandName, this.#commands.build)) {
      return await this.makeCommand(this.#commands.build);
    } else if (this.#isCommand(commandName, this.#commands.serve)) {
      return await this.makeCommand(this.#commands.serve);
    } else if (this.#isCommand(commandName, this.#commands.watch)) {
      return await this.makeCommand(this.#commands.watch);
    } else if (this.#isCommand(commandName, this.#commands.help)) {
      // Stub for the `help` command
      return await this.makeCommand(this.#commands.help);
    } else if (this.#isCommand(commandName, this.#commands.version)) {
      return await this.makeCommand(this.#commands.version);
    } else if (this.#isCommand(commandName, this.#commands.info)) {
      return await this.makeCommand(this.#commands.info);
    } else if (this.#isCommand(commandName, this.#commands.configtest)) {
      return await this.makeCommand(this.#commands.configtest);
    }

    const pkg: string = commandName;

    type Instantiable<
      InstanceType = unknown,
      ConstructorParameters extends unknown[] = unknown[],
    > = new (...args: ConstructorParameters) => InstanceType & { apply(cli: WebpackCLI): Command };

    let LoadedCommand: Instantiable<() => void>;

    try {
      LoadedCommand = (await import(pkg)).default;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ERR_MODULE_NOT_FOUND") {
        this.logger.error(`Unable to load '${pkg}' command`);
        this.logger.error(error);
        process.exit(2);
      }

      return;
    }

    let command;
    let externalCommand: Command;

    try {
      command = new LoadedCommand();
      externalCommand = await command.apply(this);
    } catch (error) {
      this.logger.error(`Unable to load '${pkg}' command`);
      this.logger.error(error);
      process.exit(2);
    }

    return externalCommand;
  }

  async run(args: readonly string[], parseOptions: ParseOptions) {
    // Default `--color` and `--no-color` options

    const self: WebpackCLI = this;

    // Register own exit
    this.program.exitOverride((error) => {
      if (error.exitCode === 0) {
        process.exit(0);
        return;
      }

      if (error.code === "commander.unknownOption") {
        let name = error.message.match(/'(.+)'/) as string | null;

        if (name) {
          name = name[1].slice(2);

          if (name.includes("=")) {
            [name] = name.split("=");
          }

          const { operands } = this.program.parseOptions(this.program.args);
          const operand =
            typeof operands[0] !== "undefined" ? operands[0] : this.#commands.build.rawName;

          if (operand) {
            const command = this.#findCommandByName(operand);

            if (!command) {
              this.logger.error(`Can't find and load command '${operand}'`);
              this.logger.error("Run 'webpack --help' to see available commands and options");
              process.exit(2);
            }

            const { allOptionNames } = command as Command & { allOptionNames?: string[] };
            const candidateNames =
              allOptionNames ??
              command.options
                .filter((option) => !(option as Option & { internal?: boolean }).internal)
                .map((option) => option.long?.slice(2) as string);

            for (const candidate of candidateNames) {
              if (candidate && WebpackCLI.#distance(name, candidate) < 3) {
                this.logger.error(`Did you mean '--${candidate}'?`);
              }
            }
          }
        }
      }

      this.logger.error("Run 'webpack --help' to see available commands and options");
      process.exit(2);
    });

    this.program.option("--color", "Enable colors on console.");
    this.program.on("option:color", function color(this: Command) {
      const { color } = this.opts();

      self.#isColorSupportChanged = color;
      self.colors = self.#createColors(color);
    });
    this.program.option("--no-color", "Disable colors on console.");
    this.program.on("option:no-color", function noColor(this: Command) {
      const { color } = this.opts();

      self.#isColorSupportChanged = color;
      self.colors = self.#createColors(color);
    });

    this.program.option(
      "-v, --version",
      "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and other packages.",
    );

    // webpack-cli has it's own logic for showing suggestions
    this.program.showSuggestionAfterError(false);

    // Suppress the default help option
    this.program.helpOption(false);
    // Suppress the default help command
    this.program.helpCommand(false);
    this.program.option("-h, --help [verbose]", "Display help for commands and options.");

    // Basic command for lazy loading other commands
    // By default we don't load any commands and options, commands and options registration takes a lot of time instead we load them lazily
    // That is why we need to set `allowUnknownOption` to `true`, otherwise commander will not work
    this.program.allowUnknownOption(true);
    // For lazy loading other commands too
    this.program.allowExcessArguments(true);
    this.program.action(async (options) => {
      const { operands, unknown } = this.program.parseOptions(this.program.args);

      // Remember the flag tokens so command setup only registers options that
      // are actually used (see `#neededOptionNames`).
      this.#argvForParsing = unknown;

      const defaultCommandNameToRun = this.#commands.build.rawName;
      const hasOperand = typeof operands[0] !== "undefined";
      const operand = hasOperand ? operands[0] : defaultCommandNameToRun;
      const isHelpOption = typeof options.help !== "undefined";
      const isHelpCommandSyntax = this.#isCommand(operand, this.#commands.help);

      if (isHelpOption || isHelpCommandSyntax) {
        let isVerbose = false;

        if (isHelpOption && typeof options.help === "string") {
          if (options.help !== "verbose") {
            this.logger.error("Unknown value for '--help' option, please use '--help=verbose'");
            process.exit(2);
          }

          isVerbose = true;
        }

        this.program.forHelp = true;

        const optionsForHelp = [
          ...(isHelpOption && hasOperand ? [operand] : []),
          ...operands.slice(1),
          ...unknown,
          ...(isHelpCommandSyntax && typeof options.color !== "undefined"
            ? [options.color ? "--color" : "--no-color"]
            : []),
          ...(isHelpCommandSyntax && typeof options.version !== "undefined" ? ["--version"] : []),
        ];

        await this.#outputHelp(optionsForHelp, isVerbose, isHelpCommandSyntax, this.program);
      }

      const isVersionOption = typeof options.version !== "undefined";

      if (isVersionOption) {
        const info = await this.#renderVersion();

        this.logger.raw(info);
        process.exit(0);
      }

      let isKnownCommand = false;

      for (const command of Object.values(this.#commands)) {
        if (
          command.rawName === operand ||
          (Array.isArray(command.alias)
            ? command.alias.includes(operand)
            : command.alias === operand)
        ) {
          isKnownCommand = true;
          break;
        }
      }

      let command: Command | undefined;
      let commandOperands = operands.slice(1);

      if (isKnownCommand) {
        command = await this.#loadCommandByName(operand);
      } else {
        let isEntrySyntax: boolean;

        try {
          await fs.promises.access(operand, fs.constants.F_OK);
          isEntrySyntax = true;
        } catch {
          isEntrySyntax = false;
        }

        if (isEntrySyntax) {
          commandOperands = operands;

          command = await this.#loadCommandByName(defaultCommandNameToRun);
        } else {
          // Try to load external command
          try {
            command = await this.#loadCommandByName(operand);
          } catch {
            // Nothing
          }

          if (!command) {
            this.logger.error(`Unknown command or entry '${operand}'`);

            const found = Object.values(this.#commands).find(
              (commandOptions) => WebpackCLI.#distance(operand, commandOptions.rawName) < 3,
            );

            if (found) {
              this.logger.error(
                `Did you mean '${found.rawName}' (alias '${Array.isArray(found.alias) ? found.alias.join(", ") : found.alias}')?`,
              );
            }

            this.logger.error("Run 'webpack --help' to see available commands and options");
            process.exit(2);
          }
        }
      }

      if (!command) {
        throw new Error(
          `Internal error: Registered command "${operand}" is missing an action handler.`,
        );
      }

      await command.parseAsync([...commandOperands, ...unknown], { from: "user" });
    });

    await this.program.parseAsync(args, parseOptions);
  }

  // Finds the highest-priority default config file by reading each candidate directory once (case-insensitively) and confirming with `access`, instead of probing every `<name><ext>` combination separately.
  async #findDefaultConfigFile(): Promise<string | undefined> {
    // Popular extensions, tried first. The common case (e.g. `webpack.config.js`)
    // matches here, so `interpret` is never loaded — see `getExoticExtensions`.
    const commonExtensions = [".js", ".mjs", ".cjs", ".ts", ".cts", ".mts"];

    // `interpret`'s extra extensions (e.g. `.coffee`) are only needed when no
    // common-extension config exists, so defer importing it until then.
    let exoticExtensions: string[] | undefined;
    const getExoticExtensions = async () => {
      if (typeof exoticExtensions === "undefined") {
        const interpret = await import("interpret");
        const common = new Set(commonExtensions);

        exoticExtensions = Object.keys(interpret.extensions).filter((ext) => !common.has(ext));
      }

      return exoticExtensions;
    };

    const directoryEntriesCache = new Map<string, Set<string> | null>();
    const readDirectoryEntries = async (directory: string) => {
      let entries = directoryEntriesCache.get(directory);

      if (typeof entries === "undefined") {
        try {
          entries = new Set(
            (await fs.promises.readdir(directory)).map((entry) => entry.toLowerCase()),
          );
        } catch {
          entries = null;
        }

        directoryEntriesCache.set(directory, entries);
      }

      return entries;
    };

    const findInExtensions = async (
      resolvedBase: string,
      basename: string,
      entries: Set<string> | null,
      extensions: string[],
    ): Promise<string | undefined> => {
      for (const ext of extensions) {
        // Skip candidates absent from the listing, but when the directory can't be listed (`entries` is `null`) probe every candidate directly.
        if (entries && !entries.has((basename + ext).toLowerCase())) {
          continue;
        }

        const candidate = resolvedBase + ext;

        // Confirm with `access` to preserve exact existence semantics (e.g.
        // broken symlinks are listed by `readdir` but fail `access`).
        try {
          await fs.promises.access(candidate, fs.constants.F_OK);
          return candidate;
        } catch {
          // Listed but not accessible, keep looking
        }
      }

      return undefined;
    };

    // Order defines the priority, in decreasing order. Within each filename,
    // common extensions take priority over the exotic ones (matching the
    // previous combined ordering).
    for (const filename of DEFAULT_CONFIGURATION_FILES) {
      const resolvedBase = path.resolve(filename);
      const entries = await readDirectoryEntries(path.dirname(resolvedBase));
      const basename = path.basename(resolvedBase);

      const common = await findInExtensions(resolvedBase, basename, entries, commonExtensions);

      if (common) {
        return common;
      }

      const exotic = await findInExtensions(
        resolvedBase,
        basename,
        entries,
        await getExoticExtensions(),
      );

      if (exotic) {
        return exotic;
      }
    }

    return undefined;
  }

  async loadConfig(options: Options) {
    const disableInterpret =
      typeof options.disableInterpret !== "undefined" && options.disableInterpret;

    const loadConfigByPath = async (
      configPath: string,
      argv: Argv = { env: {} },
    ): Promise<{ options: Configuration | MultiConfiguration; path: string }> => {
      let options: LoadableWebpackConfiguration | undefined;

      const isFileURL = configPath.startsWith("file://");

      try {
        let loadingError;

        try {
          options = // eslint-disable-next-line no-eval
            (await eval(`import("${isFileURL ? configPath : pathToFileURL(configPath)}")`)).default;
        } catch (err) {
          if (this.isValidationError(err) || process.env?.WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG) {
            throw err;
          }

          loadingError = err;
        }

        // Fallback logic when we can't use `import(...)`
        if (loadingError) {
          const ext = path.extname(configPath).toLowerCase();
          const configFilePath = isFileURL ? fileURLToPath(configPath) : path.resolve(configPath);

          const dataFormatLoader = DATA_FORMAT_LOADERS[ext];

          if (dataFormatLoader) {
            let parser: Record<string, (source: string) => unknown>;

            try {
              // Resolve the parser from the configuration file's location (so it
              // is picked up from the user's project rather than from
              // webpack-cli), then load it asynchronously via `import(...)`.
              const parserPath = createRequire(configFilePath).resolve(dataFormatLoader.package);
              const parserModule = await import(pathToFileURL(parserPath).href);

              parser = (parserModule.default ?? parserModule) as Record<
                string,
                (source: string) => unknown
              >;
            } catch {
              this.logger.error(`Unable to load the '${configFilePath}' configuration file.`);
              this.logger.error(
                `Loading '${ext}' configuration files requires the '${dataFormatLoader.package}' package, which is not installed. Please install it, e.g. \`npm install --save-dev ${dataFormatLoader.package}\`.`,
              );
              process.exit(2);
            }

            try {
              const source = await fs.promises.readFile(configFilePath, "utf8");

              options = parser[dataFormatLoader.method](source) as LoadableWebpackConfiguration;
            } catch (err) {
              if (this.isValidationError(err)) {
                throw err;
              }

              throw new ConfigurationLoadingError([loadingError, err]);
            }
          } else {
            // `interpret`/`rechoir` still handle the JavaScript variants (`.ts`,
            // `.coffee`, `.babel.js`, ...). This path is planned to be removed
            // once those formats are loaded natively as well.
            const { jsVariants, extensions } = await import("interpret");

            let interpreted = Object.keys(jsVariants).find((variant) => variant === ext);

            if (!interpreted && ext.endsWith(".cts")) {
              interpreted = jsVariants[".ts"] as string;
            }

            if (interpreted && !disableInterpret) {
              const rechoir: Rechoir = (await import("rechoir")).default;

              try {
                rechoir.prepare(extensions, configPath);
              } catch (error) {
                if ((error as RechoirError)?.failures) {
                  this.logger.error(`Unable load '${configPath}'`);
                  this.logger.error((error as RechoirError).message);
                  for (const failure of (error as RechoirError).failures) {
                    this.logger.error(failure.error.message);
                  }
                  this.logger.error("Please install one of them");
                  process.exit(2);
                }
                this.logger.error(error);
                process.exit(2);
              }
            }

            try {
              options = require(configFilePath);
            } catch (err) {
              if (this.isValidationError(err)) {
                throw err;
              }

              throw new ConfigurationLoadingError([loadingError, err]);
            }
          }
        }

        // To handle `babel`/`module.exports.default = {};`
        if (options && typeof options === "object" && "default" in options) {
          options = options.default as LoadableWebpackConfiguration | undefined;
        }

        if (!options) {
          this.logger.warn(
            `Default export is missing or nullish at (from ${configPath}). Webpack will run with an empty configuration. Please double-check that this is what you want. If you want to run webpack with an empty config, \`export {}\`/\`module.exports = {};\` to remove this warning.`,
          );

          options = {};
        }
      } catch (error) {
        if (error instanceof ConfigurationLoadingError) {
          this.logger.error(`Failed to load '${configPath}' config\n${error.message}`);
        } else {
          this.logger.error(`Failed to load '${configPath}' config`);
          this.logger.error(error);
        }

        process.exit(2);
      }

      if (Array.isArray(options)) {
        const optionsArray: LoadableWebpackConfiguration[] = options;
        await Promise.all(
          optionsArray.map(async (_, i) => {
            if (
              this.isPromise<Configuration | CallableWebpackConfiguration<Configuration>>(
                optionsArray[i] as Promise<
                  Configuration | CallableWebpackConfiguration<Configuration>
                >,
              )
            ) {
              optionsArray[i] = await optionsArray[i];
            }
            // `Promise` may return `Function`
            if (this.isFunction(optionsArray[i])) {
              // when config is a function, pass the env from args to the config function
              optionsArray[i] = await optionsArray[i](argv.env, argv);
            }
          }),
        );
        options = optionsArray as MultiConfiguration;
      } else {
        if (
          this.isPromise<LoadableWebpackConfiguration>(
            options as Promise<LoadableWebpackConfiguration>,
          )
        ) {
          options = await options;
        }

        // `Promise` may return `Function`
        if (this.isFunction(options)) {
          // when config is a function, pass the env from args to the config function
          options = await options(argv.env, argv);
        }
      }

      const isObject = (value: unknown): value is object =>
        typeof value === "object" && value !== null;

      if (!isObject(options) && !Array.isArray(options)) {
        this.logger.error(`Invalid configuration in '${configPath}'`);

        process.exit(2);
      }

      return {
        options: options as Configuration | MultiConfiguration,
        path: configPath,
      };
    };

    const config: ConfigurationsAndPaths = {
      options: {},
      path: new WeakMap(),
    };

    if (options.config && options.config.length > 0) {
      const loadedConfigs = await Promise.all(
        options.config.map((configPath: string) => loadConfigByPath(configPath, options.argv)),
      );

      if (loadedConfigs.length === 1) {
        config.options = loadedConfigs[0].options;
        config.path.set(loadedConfigs[0].options, [loadedConfigs[0].path]);
      } else {
        config.options = [];
        for (const loadedConfig of loadedConfigs) {
          if (Array.isArray(loadedConfig.options)) {
            for (const item of loadedConfig.options) {
              (config.options as Configuration[]).push(item);
              config.path.set(options, [loadedConfig.path]);
            }
          } else {
            (config.options as Configuration[]).push(loadedConfig.options);
            config.path.set(loadedConfig.options, [loadedConfig.path]);
          }
        }
      }
    } else {
      const foundDefaultConfigFile = await this.#findDefaultConfigFile();

      if (foundDefaultConfigFile) {
        const loadedConfig = await loadConfigByPath(foundDefaultConfigFile, options.argv);

        config.options = loadedConfig.options;

        if (this.isMultipleConfiguration(config.options)) {
          for (const item of config.options) {
            config.path.set(item, [loadedConfig.path]);
          }
        } else {
          config.path.set(loadedConfig.options, [loadedConfig.path]);
        }
      }
    }

    if (options.configName) {
      const notFoundConfigNames: string[] = [];

      config.options = options.configName.map((configName) => {
        let found;

        if (this.isMultipleConfiguration(config.options)) {
          found = config.options.find((options) => options.name === configName);
        } else {
          found = config.options.name === configName ? config.options : undefined;
        }

        if (!found) {
          notFoundConfigNames.push(configName);
        }

        return found;
      }) as MultiConfiguration;

      if (notFoundConfigNames.length > 0) {
        this.logger.error(
          notFoundConfigNames
            .map((configName) => `Configuration with the name "${configName}" was not found.`)
            .join(" "),
        );
        process.exit(2);
      }
    }

    const resolveExtends = async (
      config: Configuration,
      configPaths: ConfigurationsAndPaths["path"],
      extendsPaths: string[],
    ): Promise<Configuration> => {
      delete config.extends;

      const loadedConfigs = await Promise.all(
        extendsPaths.map((extendsPath) => loadConfigByPath(extendsPath, options.argv)),
      );

      const { merge } = await import("webpack-merge");
      const loadedOptions = loadedConfigs.flatMap((config) => config.options);

      if (loadedOptions.length > 0) {
        const prevPaths = configPaths.get(config);
        const loadedPaths = loadedConfigs.flatMap((config) => config.path);

        if (prevPaths) {
          const intersection = loadedPaths.filter((element) => prevPaths.includes(element));

          if (intersection.length > 0) {
            this.logger.error("Recursive configuration detected, exiting.");
            process.exit(2);
          }
        }

        config = merge(...(loadedOptions as [Configuration, ...Configuration[]]), config);

        if (prevPaths) {
          configPaths.set(config, [...prevPaths, ...loadedPaths]);
        }
      }

      if (config.extends) {
        const extendsPaths = typeof config.extends === "string" ? [config.extends] : config.extends;

        config = await resolveExtends(config, configPaths, extendsPaths);
      }

      return config;
    };

    // The `extends` param in CLI gets priority over extends in config file
    if (options.extends && options.extends.length > 0) {
      const extendsPaths = options.extends;

      if (this.isMultipleConfiguration(config.options)) {
        config.options = await Promise.all(
          config.options.map((options) => resolveExtends(options, config.path, extendsPaths)),
        );
      } else {
        // load the config from the extends option
        config.options = await resolveExtends(config.options, config.path, extendsPaths);
      }
    }
    // if no extends option is passed, check if the config file has extends
    else if (
      this.isMultipleConfiguration(config.options) &&
      config.options.some((options) => options.extends)
    ) {
      config.options = await Promise.all(
        config.options.map((options) => {
          if (options.extends) {
            return resolveExtends(
              options,
              config.path,
              typeof options.extends === "string" ? [options.extends] : options.extends,
            );
          }
          return options;
        }),
      );
    } else if (!this.isMultipleConfiguration(config.options) && config.options.extends) {
      config.options = await resolveExtends(
        config.options,
        config.path,
        typeof config.options.extends === "string"
          ? [config.options.extends]
          : config.options.extends,
      );
    }

    if (options.merge) {
      const { merge } = await import("webpack-merge");

      // we can only merge when there are multiple configurations
      // either by passing multiple configs by flags or passing a
      // single config exporting an array
      if (!this.isMultipleConfiguration(config.options) || config.options.length <= 1) {
        this.logger.error("At least two configurations are required for merge.");
        process.exit(2);
      }

      const mergedConfigPaths: string[] = [];

      config.options = config.options.reduce((accumulator: object, options) => {
        const configPath = config.path.get(options);
        const mergedOptions = merge(accumulator, options);

        if (configPath) {
          mergedConfigPaths.push(...configPath);
        }

        return mergedOptions;
      }, {});
      config.path.set(config.options, mergedConfigPaths);
    }

    if (options.analyze && !(await this.isPackageInstalled("webpack-bundle-analyzer"))) {
      await this.installPackage("webpack-bundle-analyzer", {
        preMessage: () => {
          this.logger.error(
            `It looks like ${this.colors.yellow("webpack-bundle-analyzer")} is not installed.`,
          );
        },
      });

      this.logger.success(
        `${this.colors.yellow("webpack-bundle-analyzer")} was installed successfully.`,
      );
    }

    if (typeof options.progress === "string" && options.progress !== "profile") {
      this.logger.error(
        `'${options.progress}' is an invalid value for the --progress option. Only 'profile' is allowed.`,
      );
      process.exit(2);
    }

    const { default: CLIPlugin } = (await import("./plugins/cli-plugin.js")).default;

    // `getArguments()` already returns a name-keyed map of exactly the argument
    // metadata `processArguments` consumes, so use it directly (cached) instead
    // of rebuilding a `schemaToOptions` array and a lookup map on every run.
    // Computed lazily: a plain `webpack build` only has internal option keys, so
    // it skips the schema-to-arguments walk entirely.
    let builtInArgs: ReturnType<(typeof webpack)["cli"]["getArguments"]> | undefined;
    const internalBuildConfig = (configuration: Configuration) => {
      const originalWatchValue = configuration.watch;

      // Apply options
      const args: Record<string, WebpackArgument> = {};
      const values: ProcessedArguments = {};

      for (const name of Object.keys(options)) {
        if (INTERNAL_OPTION_KEYS.has(name)) continue;

        const kebabName = this.toKebabCase(name);
        const arg = (builtInArgs ??= this.#getArguments(options.webpack, undefined))[kebabName];

        if (arg) {
          args[name] = arg;
          // We really don't know what the value is
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          values[name] = options[name as keyof Options] as any;
        }
      }

      if (Object.keys(values).length > 0) {
        this.#processArguments(options.webpack, args, configuration, values);
      }

      // Output warnings
      if (!Object.isExtensible(configuration)) {
        return;
      }

      if (
        options.isWatchingLikeCommand &&
        options.argv?.env &&
        (typeof originalWatchValue !== "undefined" || typeof options.argv?.watch !== "undefined")
      ) {
        this.logger.warn(
          `No need to use the '${
            options.argv.env.WEBPACK_WATCH ? "watch" : "serve"
          }' command together with '{ watch: true | false }' or '--watch'/'--no-watch' configuration, it does not make sense.`,
        );

        if (options.argv.env.WEBPACK_SERVE) {
          configuration.watch = false;
        }
      }

      const isFileSystemCacheOptions = (
        config: Configuration,
      ): config is Configuration & { cache: FileCacheOptions } =>
        typeof config.cache !== "undefined" &&
        typeof config.cache !== "boolean" &&
        config.cache.type === "filesystem";

      // Setup default cache options
      if (isFileSystemCacheOptions(configuration) && Object.isExtensible(configuration.cache)) {
        const configPath = config.path.get(configuration);

        if (configPath) {
          if (!configuration.cache.buildDependencies) {
            configuration.cache.buildDependencies = {};
          }

          if (!configuration.cache.buildDependencies.defaultConfig) {
            configuration.cache.buildDependencies.defaultConfig = [];
          }

          const normalizeConfigPath = (configPath: string) =>
            configPath.startsWith("file://") ? fileURLToPath(configPath) : path.resolve(configPath);

          if (Array.isArray(configPath)) {
            for (const oneOfConfigPath of configPath) {
              configuration.cache.buildDependencies.defaultConfig.push(
                normalizeConfigPath(oneOfConfigPath),
              );
            }
          } else {
            configuration.cache.buildDependencies.defaultConfig.push(
              // TODO fix `file:` support on webpack side and remove it in the next major release
              normalizeConfigPath(configPath),
            );
          }
        }
      }

      // Respect `process.env.NODE_ENV`
      if (
        !configuration.mode &&
        process.env?.NODE_ENV &&
        (process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "none")
      ) {
        configuration.mode = process.env.NODE_ENV;
      }

      // Setup stats
      if (typeof configuration.stats === "undefined") {
        configuration.stats = { preset: "normal" };
      } else if (typeof configuration.stats === "boolean") {
        configuration.stats = configuration.stats ? { preset: "normal" } : { preset: "none" };
      } else if (typeof configuration.stats === "string") {
        configuration.stats = { preset: configuration.stats };
      }

      let colors;

      // From arguments
      if (typeof this.#isColorSupportChanged !== "undefined") {
        colors = Boolean(this.#isColorSupportChanged);
      }
      // From stats
      else if (typeof configuration.stats.colors !== "undefined") {
        colors = configuration.stats.colors;
      }
      // Default
      else {
        colors = Boolean(this.colors.isColorSupported);
      }

      if (Object.isExtensible(configuration.stats)) {
        configuration.stats.colors = colors;
      }

      // Apply CLI plugin
      if (!configuration.plugins) {
        configuration.plugins = [];
      }

      if (Object.isExtensible(configuration.plugins)) {
        configuration.plugins.unshift(
          new CLIPlugin({
            configPath: config.path.get(configuration),
            helpfulOutput: !options.json,
            progress: options.progress,
            analyze: options.analyze,
            isMultiCompiler: this.isMultipleConfiguration(config.options),
          }),
        );
      }
    };

    if (this.isMultipleConfiguration(config.options)) {
      for (const item of config.options) {
        internalBuildConfig(item);
      }
    } else {
      internalBuildConfig(config.options);
    }

    return config;
  }

  async createCompiler(
    options: Options,
    callback?: WebpackCallback,
  ): Promise<Compiler | MultiCompiler> {
    const { webpack } = options;

    if (typeof options.configNodeEnv === "string") {
      process.env.NODE_ENV = options.configNodeEnv;
    }

    const config = await this.loadConfig(options);
    let compiler: Compiler | MultiCompiler;

    try {
      compiler = callback
        ? webpack(config.options, (error, stats) => {
            if (error && this.isValidationError(error)) {
              this.logger.error(error.message);
              process.exit(2);
            }

            callback(error as Error | null, stats);
          })!
        : webpack(config.options);
    } catch (error) {
      if (this.isValidationError(error)) {
        this.logger.error(error.message);
      } else {
        this.logger.error(error);
      }

      process.exit(2);
    }

    return compiler;
  }

  #needWatchStdin(compiler: Compiler | MultiCompiler): boolean {
    if (this.isMultipleCompiler(compiler)) {
      return Boolean(
        compiler.compilers.some((compiler: Compiler) => compiler.options.watchOptions?.stdin),
      );
    }

    return Boolean(compiler.options.watchOptions?.stdin);
  }

  async runWebpack(options: Options, isWatchCommand: boolean): Promise<void> {
    let compiler: Compiler | MultiCompiler;
    let stringifyChunked: typeof stringifyChunkedType;
    let Readable: typeof ReadableType;

    if (options.json) {
      ({ stringifyChunked } = await import("@discoveryjs/json-ext"));
      ({ Readable } = await import("node:stream"));
    }

    const callback: WebpackCallback = (error, stats): void => {
      if (error) {
        this.logger.error(error);
        process.exit(2);
      }

      if (stats && (stats.hasErrors() || (options.failOnWarnings && stats.hasWarnings()))) {
        process.exitCode = 1;
      }

      if (!compiler || !stats) {
        return;
      }

      const statsOptions = this.isMultipleCompiler(compiler)
        ? {
            children: compiler.compilers.map((compiler) => compiler.options.stats),
          }
        : compiler.options.stats;

      if (options.json) {
        const handleWriteError = (error: Error) => {
          this.logger.error(error);
          process.exit(2);
        };

        if (options.json === true) {
          Readable.from(stringifyChunked(stats.toJson(statsOptions as StatsOptions)))
            .on("error", handleWriteError)
            .pipe(process.stdout)
            .on("error", handleWriteError)
            .on("close", () => process.stdout.write("\n"));
        } else {
          Readable.from(stringifyChunked(stats.toJson(statsOptions as StatsOptions)))
            .on("error", handleWriteError)
            .pipe(fs.createWriteStream(options.json))
            .on("error", handleWriteError)
            // Use stderr to logging
            .on("close", () => {
              process.stderr.write(
                `[webpack-cli] ${this.colors.green(
                  `stats are successfully stored as json to ${options.json}`,
                )}\n`,
              );
            });
        }
      } else {
        const printedStats = stats.toString(statsOptions);

        // Avoid extra empty line when `stats: 'none'`
        if (printedStats) {
          this.logger.raw(printedStats);
        }
      }
    };

    const env =
      isWatchCommand || options.watch
        ? { WEBPACK_WATCH: true, ...options.env }
        : { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true, ...options.env };

    options.argv = { ...options, env };

    if (isWatchCommand) {
      options.watch = true;
      options.isWatchingLikeCommand = true;
    }

    compiler = await this.createCompiler(options, callback);

    if (!compiler) {
      return;
    }

    const needGracefulShutdown = (compiler: Compiler | MultiCompiler): boolean =>
      Boolean(
        this.isMultipleCompiler(compiler)
          ? compiler.compilers.some(
              (compiler) =>
                compiler.options.watch ||
                (compiler.options.cache && compiler.options.cache.type === "filesystem"),
            )
          : compiler.options.watch ||
              (compiler.options.cache && compiler.options.cache.type === "filesystem"),
      );

    if (needGracefulShutdown(compiler)) {
      let needForceShutdown = false;

      for (const signal of EXIT_SIGNALS) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        const listener = () => {
          if (needForceShutdown) {
            process.exit(0);
          }

          // Output message after delay to avoid extra logging
          const timeout = setTimeout(() => {
            this.logger.info(
              "Gracefully shutting down. To force exit, press ^C again. Please wait...",
            );
          }, 2000);

          needForceShutdown = true;

          compiler.close(() => {
            clearTimeout(timeout);
            process.exit(0);
          });
        };

        process.on(signal, listener);
      }

      if (this.#needWatchStdin(compiler)) {
        process.stdin.on("end", () => {
          process.exit(0);
        });
        process.stdin.resume();
      }
    }
  }
}

export default WebpackCLI;
