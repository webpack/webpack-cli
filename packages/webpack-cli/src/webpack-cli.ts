import fs from "node:fs";
import path from "node:path";
import { type Readable as ReadableType } from "node:stream";
import { pathToFileURL } from "node:url";
import util from "node:util";
import { type stringifyChunked as stringifyChunkedType } from "@discoveryjs/json-ext";
import {
  type Argument,
  type Command,
  type CommandOptions as CommanderCommandOptions,
  type Help,
  Option,
  type ParseOptions,
  program,
} from "commander";
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
  type MultiStatsOptions,
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

interface Information {
  Binaries?: string[];
  Browsers?: string[];
  Monorepos?: string[];
  System?: string[];
  npmGlobalPackages?: string[];
  npmPackages?: string | string[];
}

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

interface CommandOptions extends CommanderCommandOptions {
  rawName: string;
  name: string;
  alias: string | string[];
  description?: string;
  usage?: string;
  dependencies?: string[];
  pkg?: string;
  argsDescription?: Record<string, string>;
  external?: boolean;
}

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
  // TODO search API
  helpLevel: "minimum" | "verbose";
  hidden?: boolean;
  group?: "core";
}

interface Env {
  WEBPACK_BUNDLE?: boolean;
  WEBPACK_BUILD?: boolean;
  WEBPACK_WATCH?: boolean;
  WEBPACK_SERVE?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Argv extends Record<string, any> {
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

interface Options {
  config?: string[];
  argv?: Argv;
  env?: Env;
  nodeEnv?: string;
  configNodeEnv?: string;
  watchOptionsStdin?: boolean;
  watch?: boolean;
  failOnWarnings?: boolean;
  isWatchingLikeCommand?: boolean;
  progress?: boolean | "profile";
  analyze?: boolean;
  prefetch?: string;
  json?: boolean;
  entry?: string | string[];
  merge?: boolean;
  configName?: string[];
  disableInterpret?: boolean;
  extends?: string[];
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
  colors: Colors;

  logger: Logger;

  isColorSupportChanged: boolean | undefined;

  #builtInOptionsCache: CommandOption[] | undefined;

  webpack!: typeof webpack;

  program: Command;

  constructor() {
    this.colors = this.createColors();
    this.logger = this.getLogger();

    // Initialize program
    this.program = program;
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

  isMultipleConfiguration(
    config: Configuration | MultiConfiguration,
  ): config is MultiConfiguration {
    return Array.isArray(config);
  }

  isMultipleCompiler(compiler: Compiler | MultiCompiler): compiler is MultiCompiler {
    return (compiler as MultiCompiler).compilers as unknown as boolean;
  }

  isPromise<T>(value: Promise<T>): value is Promise<T> {
    return typeof (value as unknown as Promise<T>).then === "function";
  }

  isFunction(value: unknown): value is CallableFunction {
    return typeof value === "function";
  }

  capitalizeFirstLetter(str: string | unknown): string {
    if (typeof str !== "string") {
      return "";
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  toKebabCase(str: string): string {
    return str.replaceAll(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }

  createColors(useColor?: boolean): Colors {
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

  async checkPackageExists(packageName: string): Promise<boolean> {
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

  async doInstall(packageName: string, options: { preMessage?: () => void } = {}): Promise<string> {
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

  getInfoOptions(): CommandOption[] {
    return [
      {
        name: "output",
        alias: "o",
        configs: [
          {
            type: "string",
          },
        ],
        description: "To get the output in a specified format ( accept json or markdown )",
        helpLevel: "minimum",
      },
      {
        name: "additional-package",
        alias: "a",
        configs: [{ type: "string" }],
        multiple: true,
        description: "Adds additional packages to the output",
        helpLevel: "minimum",
      },
    ];
  }

  async getInfoOutput(options: { output: string; additionalPackage: string[] }): Promise<string> {
    let { output } = options;
    const envinfoConfig: Record<string, boolean> = {};

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

    const defaultInformation: Information = {
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
      Monorepos: ["Yarn Workspaces", "Lerna"],
      System: ["OS", "CPU", "Memory"],
      npmGlobalPackages: ["webpack", "webpack-cli", "webpack-dev-server"],
    };

    let defaultPackages: string[] = ["webpack", "loader", "@webpack-cli/"];

    if (typeof options.additionalPackage !== "undefined") {
      defaultPackages = [...defaultPackages, ...options.additionalPackage];
    }

    defaultInformation.npmPackages = `{${defaultPackages.map((item) => `*${item}*`).join(",")}}`;

    const envinfo = (await import("envinfo")).default;

    let info = await envinfo.run(defaultInformation, envinfoConfig);

    info = info.replace("npmPackages", "Packages");
    info = info.replace("npmGlobalPackages", "Global Packages");

    return info;
  }

  async makeCommand(
    commandOptions: CommandOptions,
    options: CommandOption[] | (() => Promise<CommandOption[]>),
    action: Parameters<Command["action"]>[0],
  ): Promise<Command | undefined> {
    const alreadyLoaded = this.program.commands.find(
      (command) =>
        command.name() === commandOptions.name.split(" ")[0] ||
        command.aliases().includes(commandOptions.alias as string),
    );

    if (alreadyLoaded) {
      return;
    }

    const command = this.program.command(commandOptions.name, {
      hidden: commandOptions.hidden,
      isDefault: commandOptions.isDefault,
    });

    if (commandOptions.description) {
      command.description(commandOptions.description, commandOptions.argsDescription!);
    }

    if (commandOptions.usage) {
      command.usage(commandOptions.usage);
    }

    if (Array.isArray(commandOptions.alias)) {
      command.aliases(commandOptions.alias);
    } else {
      command.alias(commandOptions.alias);
    }

    // TODO search API for this
    (command as Command & { pkg: string }).pkg = commandOptions.pkg || "webpack-cli";

    let allDependenciesInstalled = true;

    if (commandOptions.dependencies && commandOptions.dependencies.length > 0) {
      for (const dependency of commandOptions.dependencies) {
        if (
          // Allow to use `./path/to/webpack.js` outside `node_modules`
          (dependency === WEBPACK_PACKAGE && WEBPACK_PACKAGE_IS_CUSTOM) ||
          // Allow to use `./path/to/webpack-dev-server.js` outside `node_modules`
          (dependency === WEBPACK_DEV_SERVER_PACKAGE && WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM)
        ) {
          continue;
        }

        const isPkgExist = await this.checkPackageExists(dependency);

        if (isPkgExist) {
          continue;
        } else if (!isPkgExist) {
          allDependenciesInstalled = false;
          continue;
        }

        await this.doInstall(dependency, {
          preMessage: () => {
            this.logger.error(
              `For using '${this.colors.green(
                commandOptions.name.split(" ")[0],
              )}' command you need to install: '${this.colors.green(dependency)}' package.`,
            );
          },
        });
      }
    }

    if (options) {
      if (typeof options === "function") {
        if (
          !allDependenciesInstalled &&
          commandOptions.dependencies &&
          commandOptions.dependencies.length > 0
        ) {
          command.description(
            `${
              commandOptions.description
            } To see all available options you need to install ${commandOptions.dependencies
              .map((dependency) => `'${dependency}'`)
              .join(", ")}.`,
          );
          options = [];
        } else {
          options = await options();
        }
      }

      for (const option of options) {
        this.makeOption(command, option);
      }
    }

    command.action(action);

    return command;
  }

  makeOption(command: Command, option: CommandOption) {
    type MainOption = Pick<
      CommandOption,
      "valueName" | "description" | "defaultValue" | "multiple"
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
    const flagsWithAlias = ["devtool", "output-path", "target", "watch", "extends"];

    if (flagsWithAlias.includes(option.name)) {
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
      mainOption.flags = `${mainOption.flags} [${mainOption.valueName || "value"}${
        mainOption.multiple ? "..." : ""
      }]`;
    } else if (mainOption.type.size > 0 && !mainOption.type.has(Boolean)) {
      mainOption.flags = `${mainOption.flags} <${mainOption.valueName || "value"}${
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

        (optionForCommand as Option & { helpLevel: string }).helpLevel = option.helpLevel;

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

        (optionForCommand as Option & { helpLevel: string }).helpLevel = option.helpLevel;

        command.addOption(optionForCommand);
      } else if (mainOption.type.has(Boolean)) {
        const optionForCommand = new Option(mainOption.flags, mainOption.description).default(
          mainOption.defaultValue,
        );

        (optionForCommand as Option & { helpLevel: string }).helpLevel = option.helpLevel;

        command.addOption(optionForCommand);
      } else {
        const optionForCommand = new Option(mainOption.flags, mainOption.description)
          .argParser([...mainOption.type][0] as (value: string, previous: unknown) => unknown)
          .default(mainOption.defaultValue);

        (optionForCommand as Option & { helpLevel: string }).helpLevel = option.helpLevel;

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

      (optionForCommand as Option & { helpLevel: string }).helpLevel = option.helpLevel;

      command.addOption(optionForCommand);
    } else if (mainOption.type.size === 0 && negativeOption) {
      const optionForCommand = new Option(mainOption.flags, mainOption.description);

      // Hide stub option
      optionForCommand.hideHelp();
      (optionForCommand as Option & { helpLevel: string }).helpLevel = option.helpLevel;

      command.addOption(optionForCommand);
    }

    if (negativeOption) {
      const optionForCommand = new Option(negativeOption.flags, negativeOption.description);

      (optionForCommand as Option & { helpLevel: string }).helpLevel = option.helpLevel;

      command.addOption(optionForCommand);
    }
  }

  getBuiltInOptions(): CommandOption[] {
    if (this.#builtInOptionsCache) {
      return this.#builtInOptionsCache;
    }

    const builtInFlags: CommandOption[] = [
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
        helpLevel: "minimum",
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
        helpLevel: "minimum",
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
        helpLevel: "minimum",
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
        helpLevel: "minimum",
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
        helpLevel: "minimum",
      },
      {
        name: "node-env",
        configs: [
          {
            type: "string",
          },
        ],
        multiple: false,
        description:
          "Sets process.env.NODE_ENV to the specified value for access within the configuration.(Deprecated: Use '--config-node-env' instead)",
        helpLevel: "minimum",
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
        helpLevel: "minimum",
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
        helpLevel: "minimum",
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
        helpLevel: "minimum",
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
        helpLevel: "minimum",
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
        helpLevel: "minimum",
      },
    ];

    // Options from webpack core to be included in the minimum help output
    const minimumHelpFlags = [
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
    ];

    // Extract all the flags being exported from core.
    // A list of cli flags generated by core can be found here https://github.com/webpack/webpack/blob/main/test/__snapshots__/Cli.basictest.js.snap
    // Fast search, `includes` is slow
    const minHelpSet = new Set(minimumHelpFlags);
    const coreArgs = this.webpack.cli.getArguments();
    // Take memory
    const options: CommandOption[] = Array.from({
      length: builtInFlags.length + Object.keys(coreArgs).length,
    });

    let i = 0;
    // Adding own options
    for (; i < builtInFlags.length; i++) options[i] = builtInFlags[i];

    // Adding core options
    for (const name in coreArgs) {
      const meta = coreArgs[name];
      options[i++] = {
        ...meta,
        name,
        description: meta.description,
        group: "core",
        helpLevel: minHelpSet.has(name) ? "minimum" : "verbose",
      };
    }

    this.#builtInOptionsCache = options;

    return options;
  }

  static #commands: Record<
    "build" | "watch" | "version" | "help" | "serve" | "info" | "configtest",
    CommandOptions
  > = {
    build: {
      rawName: "build",
      name: "build [entries...]",
      alias: ["bundle", "b"],
      description: "Run webpack (default command, can be omitted).",
      usage: "[entries...] [options]",
      dependencies: [WEBPACK_PACKAGE],
    },
    watch: {
      rawName: "watch",
      name: "watch [entries...]",
      alias: "w",
      description: "Run webpack and watch for files changes.",
      usage: "[entries...] [options]",
      dependencies: [WEBPACK_PACKAGE],
    },
    serve: {
      rawName: "serve",
      name: "serve [entries...]",
      alias: ["server", "s"],
      description: "Run the webpack dev server and watch for source file changes while serving.",
      usage: "[entries...] [options]",
      dependencies: [WEBPACK_PACKAGE, WEBPACK_DEV_SERVER_PACKAGE],
    },
    version: {
      rawName: "version",
      name: "version",
      alias: "v",
      usage: "[options]",
      description:
        "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
    },
    info: {
      rawName: "info",
      name: "info",
      alias: "i",
      usage: "[options]",
      description: "Outputs information about your system.",
    },
    help: {
      rawName: "help",
      name: "help [command] [option]",
      alias: "h",
      description: "Display help for commands and options.",
    },
    configtest: {
      rawName: "configtest",
      name: "configtest [config-path]",
      alias: "t",
      description: "Validate a webpack configuration.",
      dependencies: [WEBPACK_PACKAGE],
    },
  };

  #findCommandByName(name: string) {
    return this.program.commands.find(
      (command) => name === command.name() || command.aliases().includes(name),
    );
  }

  #isCommand(input: string, commandOptions: CommandOptions) {
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

  async loadWebpack(): Promise<typeof webpack> {
    return (await import(WEBPACK_PACKAGE)).default;
  }

  async #loadCommandByName(commandName: string, allowToInstall = false) {
    const isBuildCommandUsed = this.#isCommand(commandName, WebpackCLI.#commands.build);
    const isWatchCommandUsed = this.#isCommand(commandName, WebpackCLI.#commands.watch);

    if (isBuildCommandUsed || isWatchCommandUsed) {
      await this.makeCommand(
        isBuildCommandUsed ? WebpackCLI.#commands.build : WebpackCLI.#commands.watch,
        async () => {
          this.webpack = await this.loadWebpack();

          return this.getBuiltInOptions();
        },
        async (entries, options) => {
          if (entries.length > 0) {
            options.entry = [...entries, ...(options.entry || [])];
          }

          await this.runWebpack(options, isWatchCommandUsed);
        },
      );
    } else if (this.#isCommand(commandName, WebpackCLI.#commands.serve)) {
      const loadDevServerOptions = async () => {
        const devServer = (await import(WEBPACK_DEV_SERVER_PACKAGE)).default;

        const options = this.webpack.cli.getArguments(devServer.schema) as unknown as Record<
          string,
          CommandOption
        >;

        return Object.keys(options).map((key) => {
          options[key].name = key;

          return options[key];
        });
      };

      await this.makeCommand(
        WebpackCLI.#commands.serve,
        async () => {
          this.webpack = await this.loadWebpack();

          let devServerOptions = [];

          try {
            devServerOptions = await loadDevServerOptions();
          } catch (error) {
            this.logger.error(
              `You need to install 'webpack-dev-server' for running 'webpack serve'.\n${error}`,
            );
            process.exit(2);
          }

          const webpackOptions = this.getBuiltInOptions();

          return [...webpackOptions, ...devServerOptions];
        },
        async (entries: string[], options) => {
          const builtInOptions = this.getBuiltInOptions();
          let devServerFlags: CommandOption[] = [];

          try {
            devServerFlags = await loadDevServerOptions();
          } catch {
            // Nothing, to prevent future updates
          }

          const webpackCLIOptions: Partial<Options> = {};
          const devServerCLIOptions: Record<string, CommandOption> = {};

          for (const optionName in options) {
            const kebabedOption = this.toKebabCase(optionName);
            const isBuiltInOption = builtInOptions.find(
              (builtInOption) => builtInOption.name === kebabedOption,
            );

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

          webpackCLIOptions.isWatchingLikeCommand = true;

          const compiler = await this.createCompiler(webpackCLIOptions as Options);

          if (!compiler) {
            return;
          }

          type DevServerConstructor = typeof import("webpack-dev-server");
          let DevServer: DevServerConstructor;

          try {
            DevServer = (await import(WEBPACK_DEV_SERVER_PACKAGE)).default;
          } catch (err) {
            this.logger.error(
              `You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`,
            );
            process.exit(2);
          }

          const servers: InstanceType<DevServerConstructor>[] = [];

          if (this.needWatchStdin(compiler)) {
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

          for (const compilerForDevServer of compilersForDevServer) {
            if (compilerForDevServer.options.devServer === false) {
              continue;
            }

            const devServerConfiguration: DevServerConfiguration = {
              ...compilerForDevServer.options.devServer,
            };

            const args: Record<string, WebpackArgument> = {};

            for (const flag of devServerFlags) {
              args[flag.name] = flag as unknown as WebpackArgument;
            }

            const values: ProcessedArguments = {};

            for (const name of Object.keys(options)) {
              const kebabName = this.toKebabCase(name);

              if (args[kebabName] !== undefined) {
                values[kebabName] = options[name];
              }
            }

            if (Object.keys(values).length > 0) {
              const problems = this.webpack.cli.processArguments(
                args,
                devServerConfiguration,
                values,
              );

              if (problems) {
                const groupBy = <K extends keyof Problem & StringsKeys<Problem>>(
                  xs: Problem[],
                  key: K,
                ) =>
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
                      `${this.capitalizeFirstLetter(problem.type.replace("-", " "))}${
                        problem.value ? ` '${problem.value}'` : ""
                      } for the '--${problem.argument}' option${
                        problem.index ? ` by index '${problem.index}'` : ""
                      }`,
                    );

                    if (problem.expected) {
                      this.logger.error(`Expected: '${problem.expected}'`);
                    }
                  }
                }

                process.exit(2);
              }
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
      );
    } else if (this.#isCommand(commandName, WebpackCLI.#commands.help)) {
      await this.makeCommand(WebpackCLI.#commands.help, [], () => {
        // Stub for the `help` command
      });
    } else if (this.#isCommand(commandName, WebpackCLI.#commands.version)) {
      await this.makeCommand(
        WebpackCLI.#commands.version,
        this.getInfoOptions(),
        async (options: { output: string; additionalPackage: string[] }) => {
          const info = await this.getInfoOutput(options);

          this.logger.raw(info);
        },
      );
    } else if (this.#isCommand(commandName, WebpackCLI.#commands.info)) {
      await this.makeCommand(
        WebpackCLI.#commands.info,
        this.getInfoOptions(),
        async (options: { output: string; additionalPackage: string[] }) => {
          const info = await this.getInfoOutput(options);

          this.logger.raw(info);
        },
      );
    } else if (this.#isCommand(commandName, WebpackCLI.#commands.configtest)) {
      await this.makeCommand(
        WebpackCLI.#commands.configtest,
        [],
        async (configPath: string | undefined) => {
          this.webpack = await this.loadWebpack();

          const env: Env = {};
          const argv: Argv = { env };
          const config = await this.loadConfig(
            configPath ? { config: [configPath] } : { env, argv },
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
            this.webpack.validate(config.options);
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
      );
    } else {
      const builtInExternalCommandInfo = Object.values(WebpackCLI.#commands)
        .filter((item) => item.external)
        .find(
          (externalBuiltInCommandInfo) =>
            externalBuiltInCommandInfo.rawName === commandName ||
            (Array.isArray(externalBuiltInCommandInfo.alias)
              ? externalBuiltInCommandInfo.alias.includes(commandName)
              : externalBuiltInCommandInfo.alias === commandName),
        );

      let pkg: string;

      if (builtInExternalCommandInfo) {
        ({ pkg } = builtInExternalCommandInfo as CommandOptions & { pkg: string });
      } else {
        pkg = commandName;
      }

      if (pkg !== "webpack-cli" && !(await this.checkPackageExists(pkg))) {
        if (!allowToInstall) {
          return;
        }

        pkg = await this.doInstall(pkg, {
          preMessage: () => {
            this.logger.error(
              `For using this command you need to install: '${this.colors.green(pkg)}' package.`,
            );
          },
        });
      }

      type Instantiable<
        InstanceType = unknown,
        ConstructorParameters extends unknown[] = unknown[],
      > = new (...args: ConstructorParameters) => InstanceType;

      let loadedCommand: Instantiable<() => void>;

      try {
        loadedCommand = (await import(pkg)).default;
      } catch {
        // Ignore, command is not installed
        return;
      }

      let command;

      try {
        // eslint-disable-next-line new-cap
        command = new loadedCommand();

        await command.apply(this);
      } catch (error) {
        this.logger.error(`Unable to load '${pkg}' command`);
        this.logger.error(error);
        process.exit(2);
      }
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
          const humanReadableArgumentName = (argument: Argument) => {
            const nameOutput = argument.name() + (argument.variadic ? "..." : "");

            return argument.required ? `<${nameOutput}>` : `[${nameOutput}]`;
          };
          const args = command.registeredArguments
            .map((arg) => humanReadableArgumentName(arg))
            .join(" ");

          return `${command.name()}|${command.aliases().join("|")}${args ? ` ${args}` : ""}${
            command.options.length > 0 ? " [options]" : ""
          }`;
        },
        visibleOptions: function visibleOptions(command) {
          return command.options.filter((option) => {
            if (option.hidden) {
              return false;
            }

            // Hide `--watch` option when developer use `webpack watch --help`
            if (
              (options[0] === "w" || options[0] === "watch") &&
              (option.name() === "watch" || option.name() === "no-watch")
            ) {
              return false;
            }

            switch ((option as unknown as CommandOption).helpLevel) {
              case "verbose":
                return isVerbose;
              case "minimum":
              default:
                return true;
            }
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
          const termWidth = helper.padWidth(command, helper);
          const helpWidth =
            helper.helpWidth || (process.env.WEBPACK_CLI_HELP_WIDTH as unknown as number) || 80;
          const itemIndentWidth = 2;
          const itemSeparatorWidth = 2; // between term and description

          const formatItem = (term: string, description: string) => {
            if (description) {
              const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;

              return helper.wrap(
                fullText,
                helpWidth - itemIndentWidth,
                termWidth + itemSeparatorWidth,
              );
            }

            return term;
          };

          const formatList = (textArray: string[]) =>
            textArray.join("\n").replaceAll(/^/gm, " ".repeat(itemIndentWidth));

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
          Object.values(WebpackCLI.#commands).map((knownCommand) =>
            this.#loadCommandByName(knownCommand.rawName),
          ),
        );

        const buildCommand = this.#findCommandByName(WebpackCLI.#commands.build.rawName);

        if (buildCommand) {
          this.logger.raw(buildCommand.helpInformation());
        }
      } else {
        const [name] = options;

        await this.#loadCommandByName(name);

        const command = this.#findCommandByName(name);

        if (!command) {
          const builtInCommandUsed = Object.values(WebpackCLI.#commands).find(
            (command) => command.name.includes(name) || name === command.alias,
          );
          if (typeof builtInCommandUsed !== "undefined") {
            this.logger.error(
              `For using '${name}' command you need to install '${builtInCommandUsed.pkg}' package.`,
            );
          } else {
            this.logger.error(`Can't find and load command '${name}'`);
            this.logger.error("Run 'webpack --help' to see available commands and options.");
          }
          process.exit(2);
        }

        this.logger.raw(command.helpInformation());
      }
    } else if (isHelpCommandSyntax) {
      let isCommandSpecified = false;
      let commandName = WebpackCLI.#commands.build.rawName;
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

      await this.#loadCommandByName(commandName);

      const command = isGlobalOption(optionName) ? program : this.#findCommandByName(commandName);

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

      if (!option.negate && option.defaultValue) {
        this.logger.raw(`${bold("Default value:")} ${JSON.stringify(option.defaultValue)}`);
      }

      const flag = this.getBuiltInOptions().find((flag) => option.long === `--${flag.name}`);

      if (flag?.configs) {
        const possibleValues = flag.configs.reduce((accumulator, currentValue) => {
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

  async run(args: readonly string[], parseOptions: ParseOptions) {
    // Default `--color` and `--no-color` options
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: WebpackCLI = this;

    // Register own exit
    this.program.exitOverride((error) => {
      if (error.exitCode === 0) {
        process.exit(0);
        return;
      }

      const isInfo = ["commander.helpDisplayed", "commander.version"].includes(error.code);

      if (isInfo) {
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
            typeof operands[0] !== "undefined" ? operands[0] : WebpackCLI.#commands.build.rawName;

          if (operand) {
            const command = this.#findCommandByName(operand);

            if (!command) {
              this.logger.error(`Can't find and load command '${operand}'`);
              this.logger.error("Run 'webpack --help' to see available commands and options");
              process.exit(2);
            }

            const { distance } = require("fastest-levenshtein");

            for (const option of (command as Command).options) {
              if (!option.hidden && distance(name, option.long?.slice(2) as string) < 3) {
                this.logger.error(`Did you mean '--${option.name()}'?`);
              }
            }
          }
        }
      }

      this.logger.error("Run 'webpack --help' to see available commands and options");
      process.exit(2);

      throw error;
    });

    this.program.option("--color", "Enable colors on console.");
    this.program.on("option:color", function color(this: Command) {
      const { color } = this.opts();

      self.isColorSupportChanged = color;
      self.colors = self.createColors(color);
    });
    this.program.option("--no-color", "Disable colors on console.");
    this.program.on("option:no-color", function noColor(this: Command) {
      const { color } = this.opts();

      self.isColorSupportChanged = color;
      self.colors = self.createColors(color);
    });

    this.program.option(
      "-v, --version",
      "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
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
    this.program.action(async (options) => {
      const { operands, unknown } = this.program.parseOptions(this.program.args);
      const defaultCommandNameToRun = WebpackCLI.#commands.build.rawName;
      const hasOperand = typeof operands[0] !== "undefined";
      const operand = hasOperand ? operands[0] : defaultCommandNameToRun;
      const isHelpOption = typeof options.help !== "undefined";
      const isHelpCommandSyntax = this.#isCommand(operand, WebpackCLI.#commands.help);

      if (isHelpOption || isHelpCommandSyntax) {
        let isVerbose = false;

        if (isHelpOption && typeof options.help === "string") {
          if (options.help !== "verbose") {
            this.logger.error("Unknown value for '--help' option, please use '--help=verbose'");
            process.exit(2);
          }

          isVerbose = true;
        }

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
        const info = await this.getInfoOutput({ output: "", additionalPackage: [] });
        this.logger.raw(info);
        process.exit(0);
      }

      let commandNameToRun = operand;
      let commandOperands = operands.slice(1);

      let isKnownCommand = false;

      for (const command of Object.values(WebpackCLI.#commands)) {
        if (
          command.rawName === commandNameToRun ||
          (Array.isArray(command.alias)
            ? command.alias.includes(commandNameToRun)
            : command.alias === commandNameToRun)
        ) {
          isKnownCommand = true;
          break;
        }
      }

      if (isKnownCommand) {
        await this.#loadCommandByName(commandNameToRun, true);
      } else {
        let isEntrySyntax: boolean;

        try {
          await fs.promises.access(operand, fs.constants.F_OK);
          isEntrySyntax = true;
        } catch {
          isEntrySyntax = false;
        }

        if (isEntrySyntax) {
          commandNameToRun = defaultCommandNameToRun;
          commandOperands = operands;

          await this.#loadCommandByName(commandNameToRun);
        } else {
          this.logger.error(`Unknown command or entry '${operand}'`);

          const { distance } = await import("fastest-levenshtein");

          const found = Object.values(WebpackCLI.#commands).find(
            (commandOptions) => distance(operand, commandOptions.rawName) < 3,
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

      const command = this.#findCommandByName(commandNameToRun);

      if (!command) {
        throw new Error(
          `Internal error: Registered command "${commandNameToRun}" is missing an action handler.`,
        );
      }

      await command.parseAsync([...commandOperands, ...unknown], { from: "user" });
    });

    await this.program.parseAsync(args, parseOptions);
  }

  async #loadConfigurationFile(
    configPath: string,
    disableInterpret = false,
  ): Promise<LoadableWebpackConfiguration | undefined> {
    let pkg: LoadableWebpackConfiguration | undefined;

    let loadingError;

    try {
      // eslint-disable-next-line no-eval
      pkg = (await eval(`import("${pathToFileURL(configPath)}")`)).default;
    } catch (err) {
      if (this.isValidationError(err) || process.env?.WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG) {
        throw err;
      }

      loadingError = err;
    }

    // Fallback logic when we can't use `import(...)`
    if (loadingError) {
      const { jsVariants, extensions } = await import("interpret");
      const ext = path.extname(configPath).toLowerCase();

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
        pkg = require(configPath);
      } catch (err) {
        if (this.isValidationError(err)) {
          throw err;
        }

        throw new ConfigurationLoadingError([loadingError, err]);
      }
    }

    // To handle `babel`/`module.exports.default = {};`
    if (pkg && typeof pkg === "object" && "default" in pkg) {
      pkg = pkg.default as LoadableWebpackConfiguration | undefined;
    }

    if (!pkg) {
      this.logger.warn(
        `Default export is missing or nullish at (from ${configPath}). Webpack will run with an empty configuration. Please double-check that this is what you want. If you want to run webpack with an empty config, \`export {}\`/\`module.exports = {};\` to remove this warning.`,
      );
    }

    return pkg || {};
  }

  async loadConfig(options: Options) {
    const disableInterpret =
      typeof options.disableInterpret !== "undefined" && options.disableInterpret;

    const loadConfigByPath = async (
      configPath: string,
      argv: Argv = { env: {} },
    ): Promise<{ options: Configuration | MultiConfiguration; path: string }> => {
      let options: LoadableWebpackConfiguration | undefined;

      try {
        options = await this.#loadConfigurationFile(configPath, disableInterpret);
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
        options.config.map((configPath: string) =>
          loadConfigByPath(path.resolve(configPath), options.argv),
        ),
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
      const interpret = await import("interpret");
      // Prioritize popular extensions first to avoid unnecessary fs calls
      const extensions = new Set([
        ".js",
        ".mjs",
        ".cjs",
        ".ts",
        ".cts",
        ".mts",
        ...Object.keys(interpret.extensions),
      ]);
      // Order defines the priority, in decreasing order
      const defaultConfigFiles = new Set(
        DEFAULT_CONFIGURATION_FILES.flatMap((filename) =>
          [...extensions].map((ext) => path.resolve(filename + ext)),
        ),
      );

      let foundDefaultConfigFile;

      for (const defaultConfigFile of defaultConfigFiles) {
        try {
          await fs.promises.access(defaultConfigFile, fs.constants.F_OK);
          foundDefaultConfigFile = defaultConfigFile;
          break;
        } catch {
          continue;
        }
      }

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
        extendsPaths.map((extendsPath) =>
          loadConfigByPath(path.resolve(extendsPath), options.argv),
        ),
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

    return config;
  }

  async buildConfig(
    config: ConfigurationsAndPaths,
    options: Options,
  ): Promise<ConfigurationsAndPaths> {
    if (options.analyze && !(await this.checkPackageExists("webpack-bundle-analyzer"))) {
      await this.doInstall("webpack-bundle-analyzer", {
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

    const internalBuildConfig = (item: Configuration) => {
      const originalWatchValue = item.watch;

      // Apply options
      const builtInOptions = this.getBuiltInOptions();
      const args: Record<string, WebpackArgument> = {};

      for (const flag of builtInOptions) {
        if (flag.group === "core") {
          args[flag.name] = flag as unknown as WebpackArgument;
        }
      }

      const values: ProcessedArguments = {};

      for (const name of Object.keys(options)) {
        if (name === "argv") continue;

        const kebabName = this.toKebabCase(name);

        if (args[kebabName] !== undefined) {
          values[kebabName] = options[name as keyof Options] as string[];
        }
      }

      if (Object.keys(values).length > 0) {
        const problems = this.webpack.cli.processArguments(args, item, values);

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
          const problemsByPath = groupBy(problems, "path");

          for (const path in problemsByPath) {
            const problems = problemsByPath[path];

            for (const problem of problems) {
              this.logger.error(
                `${this.capitalizeFirstLetter(problem.type.replaceAll("-", " "))}${
                  problem.value ? ` '${problem.value}'` : ""
                } for the '--${problem.argument}' option${
                  problem.index ? ` by index '${problem.index}'` : ""
                }`,
              );

              if (problem.expected) {
                this.logger.error(`Expected: '${problem.expected}'`);
              }
            }
          }

          process.exit(2);
        }
      }

      // Output warnings
      if (!Object.isExtensible(item)) {
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
          item.watch = false;
        }
      }

      const isFileSystemCacheOptions = (
        config: Configuration,
      ): config is Configuration & { cache: FileCacheOptions } =>
        typeof config.cache !== "undefined" &&
        typeof config.cache !== "boolean" &&
        config.cache.type === "filesystem";

      // Setup default cache options
      if (isFileSystemCacheOptions(item) && Object.isExtensible(item.cache)) {
        const configPath = config.path.get(item);

        if (configPath) {
          if (!item.cache.buildDependencies) {
            item.cache.buildDependencies = {};
          }

          if (!item.cache.buildDependencies.defaultConfig) {
            item.cache.buildDependencies.defaultConfig = [];
          }

          if (Array.isArray(configPath)) {
            for (const oneOfConfigPath of configPath) {
              item.cache.buildDependencies.defaultConfig.push(oneOfConfigPath);
            }
          } else {
            item.cache.buildDependencies.defaultConfig.push(configPath);
          }
        }
      }

      // Respect `process.env.NODE_ENV`
      if (
        !item.mode &&
        process.env?.NODE_ENV &&
        (process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "none")
      ) {
        item.mode = process.env.NODE_ENV;
      }

      // Setup stats
      if (typeof item.stats === "undefined") {
        item.stats = { preset: "normal" };
      } else if (typeof item.stats === "boolean") {
        item.stats = item.stats ? { preset: "normal" } : { preset: "none" };
      } else if (typeof item.stats === "string") {
        item.stats = { preset: item.stats };
      }

      let colors;

      // From arguments
      if (typeof this.isColorSupportChanged !== "undefined") {
        colors = Boolean(this.isColorSupportChanged);
      }
      // From stats
      else if (typeof item.stats.colors !== "undefined") {
        colors = item.stats.colors;
      }
      // Default
      else {
        colors = Boolean(this.colors.isColorSupported);
      }

      if (Object.isExtensible(item.stats)) {
        item.stats.colors = colors;
      }

      // Apply CLI plugin
      if (!item.plugins) {
        item.plugins = [];
      }

      if (Object.isExtensible(item.plugins)) {
        item.plugins.unshift(
          new CLIPlugin({
            configPath: config.path.get(item),
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

  isValidationError(error: unknown): error is WebpackError {
    return (
      error instanceof this.webpack.ValidationError || (error as Error).name === "ValidationError"
    );
  }

  async createCompiler(
    options: Options,
    callback?: WebpackCallback,
  ): Promise<Compiler | MultiCompiler> {
    if (typeof options.configNodeEnv === "string") {
      process.env.NODE_ENV = options.configNodeEnv;
    }
    // TODO remove in the next major release
    else if (typeof options.nodeEnv === "string") {
      process.env.NODE_ENV = options.nodeEnv;
    }

    let config = await this.loadConfig(options);
    config = await this.buildConfig(config, options);

    let compiler: Compiler | MultiCompiler;

    try {
      compiler = callback
        ? this.webpack(config.options, (error, stats) => {
            if (error && this.isValidationError(error)) {
              this.logger.error(error.message);
              process.exit(2);
            }

            callback(error as Error | null, stats);
          })!
        : this.webpack(config.options);
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

  needWatchStdin(compiler: Compiler | MultiCompiler): boolean {
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
        ? ({
            children: compiler.compilers.map((compiler) =>
              compiler.options ? compiler.options.stats : undefined,
            ),
          } as MultiStatsOptions)
        : compiler.options
          ? (compiler.options.stats as StatsOptions)
          : undefined;

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
        const printedStats = stats.toString(statsOptions as StatsOptions);

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

      if (this.needWatchStdin(compiler)) {
        process.stdin.on("end", () => {
          process.exit(0);
        });
        process.stdin.resume();
      }
    }
  }
}

export default WebpackCLI;
