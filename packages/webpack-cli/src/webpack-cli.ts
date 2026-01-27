import { type stringifyChunked } from "@discoveryjs/json-ext";
import { type ParseOptions } from "commander";
import {
  type Compiler,
  type Configuration,
  type MultiCompiler,
  type MultiConfiguration,
  type MultiStatsOptions,
  type StatsOptions,
  type WebpackError,
  default as webpack,
} from "webpack";
import type webpackMerge from "webpack-merge";

import { type CLIPlugin as CLIPluginClass } from "./plugins/cli-plugin.js";
import {
  type Argument,
  type Argv,
  type BasicPrimitive,
  type CLIPluginOptions,
  type CallableWebpackConfiguration,
  type DynamicImport,
  type FileSystemCacheOptions,
  type ImportLoaderError,
  type Instantiable,
  type JsonExt,
  type LoadableWebpackConfiguration,
  type ModuleName,
  type PackageInstallOptions,
  type PackageManager,
  type Path,
  type PotentialPromise,
  type Problem,
  type ProcessedArguments,
  type PromptOptions,
  type Rechoir,
  type RechoirError,
  type StringsKeys,
  type WebpackCLIBuiltInFlag,
  type WebpackCLIBuiltInOption,
  type WebpackCLIColors,
  type WebpackCLICommand,
  type WebpackCLICommandOption,
  type WebpackCLIConfig,
  type WebpackCLILogger,
  type WebpackCLIMainOption,
  type WebpackCLIOptions,
  type WebpackCallback,
  type WebpackCompiler,
  type WebpackDevServerOptions,
  type WebpackRunOptions,
} from "./types.js";

const fs = require("node:fs");
const path = require("node:path");
const { Readable } = require("node:stream");
const { pathToFileURL } = require("node:url");
const util = require("node:util");
const { Option, program } = require("commander");

const WEBPACK_PACKAGE_IS_CUSTOM = Boolean(process.env.WEBPACK_PACKAGE);
const WEBPACK_PACKAGE = WEBPACK_PACKAGE_IS_CUSTOM
  ? (process.env.WEBPACK_PACKAGE as string)
  : "webpack";
const WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM = Boolean(process.env.WEBPACK_DEV_SERVER_PACKAGE);
const WEBPACK_DEV_SERVER_PACKAGE = WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM
  ? (process.env.WEBPACK_DEV_SERVER_PACKAGE as string)
  : "webpack-dev-server";

const EXIT_SIGNALS = ["SIGINT", "SIGTERM"];

interface Information {
  Binaries?: string[];
  Browsers?: string[];
  Monorepos?: string[];
  System?: string[];
  npmGlobalPackages?: string[];
  npmPackages?: string | string[];
}

class WebpackCLI {
  colors: WebpackCLIColors;

  logger: WebpackCLILogger;

  isColorSupportChanged: boolean | undefined;

  builtInOptionsCache: WebpackCLIBuiltInOption[] | undefined;

  webpack!: typeof webpack;

  program: WebpackCLICommand;

  constructor() {
    this.colors = this.createColors();
    this.logger = this.getLogger();

    // Initialize program
    this.program = program;
    this.program.name("webpack");
    this.program.configureOutput({
      writeErr: (str) => this.logger.error(str, true),
      outputError: (str, write) => {
        write(`Error: ${this.capitalizeFirstLetter(str.replace(/^error:\s*/, ""))}`);
      },
    });

    // The CLI exits with code '2' instead of code '1'
    this.program.exitOverride(({ exitCode }) => {
      if (exitCode === 1) {
        process.exit(2);
      }
    });

    this.program.showHelpAfterError("Run 'webpack --help' to see available commands and options");
  }

  isMultipleConfiguration(
    config: Configuration | MultiConfiguration,
  ): config is MultiConfiguration {
    return Array.isArray(config);
  }

  isMultipleCompiler(compiler: WebpackCompiler): compiler is MultiCompiler {
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

  createColors(useColor?: boolean): WebpackCLIColors {
    try {
      const { cli } = require("webpack");

      if (typeof cli.createColors === "function") {
        const { createColors, isColorSupported } = cli;
        const shouldUseColor = useColor || isColorSupported();

        return { ...createColors({ useColor: shouldUseColor }), isColorSupported: shouldUseColor };
      }
    } catch {
      // Nothing
    }

    // TODO remove `colorette` and set webpack@5.101.0 as the minimum supported version in the next major release
    const { createColors, isColorSupported } = require("colorette");

    const shouldUseColor = useColor || isColorSupported;

    return { ...createColors({ useColor: shouldUseColor }), isColorSupported: shouldUseColor };
  }

  getLogger(): WebpackCLILogger {
    const log = (method: "error" | "warn" | "info" | "log", val: string, raw?: boolean) =>
      raw
        ? process[method === "error" ? "stderr" : "stdout"].write(`[webpack-cli] ${val}`)
        : console[method](`[webpack-cli] ${val}`);

    return {
      error: (val, raw) => log("error", this.colors.red(util.format(val)), raw),
      warn: (val, raw) => log("warn", this.colors.red(util.format(val)), raw),
      info: (val, raw) => log("info", this.colors.red(util.format(val)), raw),
      success: (val, raw) => log("log", this.colors.red(util.format(val)), raw),
      log: (val, raw) => log("error", this.colors.red(util.format(val)), raw),
      raw: (val) => console.log(val),
    };
  }

  checkPackageExists(packageName: string): boolean {
    if (process.versions.pnp) {
      return true;
    }

    let dir = __dirname;

    do {
      try {
        if (fs.statSync(path.join(dir, "node_modules", packageName)).isDirectory()) {
          return true;
        }
      } catch {
        // Nothing
      }
    } while (dir !== (dir = path.dirname(dir)));

    // https://github.com/nodejs/node/blob/v18.9.1/lib/internal/modules/cjs/loader.js#L1274
    for (const internalPath of require("node:module").globalPaths) {
      try {
        if (fs.statSync(path.join(internalPath, packageName)).isDirectory()) {
          return true;
        }
      } catch {
        // Nothing
      }
    }

    return false;
  }

  getAvailablePackageManagers(): PackageManager[] {
    const { sync } = require("cross-spawn");

    const installers: PackageManager[] = ["npm", "yarn", "pnpm"];
    const hasPackageManagerInstalled = (packageManager: PackageManager) => {
      try {
        sync(packageManager, ["--version"]);

        return packageManager;
      } catch {
        return false;
      }
    };
    const availableInstallers = installers.filter((installer) =>
      hasPackageManagerInstalled(installer),
    );

    if (!availableInstallers.length) {
      this.logger.error("No package manager found.");

      process.exit(2);
    }

    return availableInstallers;
  }

  getDefaultPackageManager(): PackageManager | undefined {
    const { sync } = require("cross-spawn");

    const hasLocalNpm = fs.existsSync(path.resolve(process.cwd(), "package-lock.json"));

    if (hasLocalNpm) {
      return "npm";
    }

    const hasLocalYarn = fs.existsSync(path.resolve(process.cwd(), "yarn.lock"));

    if (hasLocalYarn) {
      return "yarn";
    }

    const hasLocalPnpm = fs.existsSync(path.resolve(process.cwd(), "pnpm-lock.yaml"));

    if (hasLocalPnpm) {
      return "pnpm";
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

  async doInstall(packageName: string, options: PackageInstallOptions = {}): Promise<string> {
    const packageManager = this.getDefaultPackageManager();

    if (!packageManager) {
      this.logger.error("Can't find package manager");

      process.exit(2);
    }

    if (options.preMessage) {
      options.preMessage();
    }

    const prompt = ({ message, defaultResponse, stream }: PromptOptions) => {
      const readline = require("node:readline");

      const rl = readline.createInterface({
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
      const { sync } = require("cross-spawn");

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

  async tryRequireThenImport<T>(
    module: ModuleName,
    handleError = true,
    moduleType: "unknown" | "commonjs" | "esm" = "unknown",
  ): Promise<T> {
    let result;

    switch (moduleType) {
      case "unknown": {
        try {
          result = require(module);
        } catch (error) {
          const dynamicImportLoader: null | DynamicImport<T> =
            require("./utils/dynamic-import-loader")();

          if (
            ((error as ImportLoaderError).code === "ERR_REQUIRE_ESM" ||
              (error as ImportLoaderError).code === "ERR_REQUIRE_ASYNC_MODULE" ||
              process.env.WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG) &&
            pathToFileURL &&
            dynamicImportLoader
          ) {
            const urlForConfig = pathToFileURL(module);

            result = await dynamicImportLoader(urlForConfig);
            result = result.default;

            return result;
          }

          if (handleError) {
            this.logger.error(error);
            process.exit(2);
          } else {
            throw error;
          }
        }
        break;
      }
      case "commonjs": {
        try {
          result = require(module);
        } catch (error) {
          if (handleError) {
            this.logger.error(error);
            process.exit(2);
          } else {
            throw error;
          }
        }
        break;
      }
      case "esm": {
        try {
          const dynamicImportLoader: null | DynamicImport<T> =
            require("./utils/dynamic-import-loader")();

          if (pathToFileURL && dynamicImportLoader) {
            const urlForConfig = pathToFileURL(module);

            result = await dynamicImportLoader(urlForConfig);
            result = result.default;

            return result;
          }
        } catch (error) {
          if (handleError) {
            this.logger.error(error);
            process.exit(2);
          } else {
            throw error;
          }
        }

        break;
      }
    }

    // For babel and other, only commonjs
    if (result && typeof result === "object" && "default" in result) {
      result = result.default || {};
    }

    return result || {};
  }

  loadJSONFile<T = unknown>(pathToFile: Path, handleError = true): T {
    let result;

    try {
      result = require(pathToFile);
    } catch (error) {
      if (handleError) {
        this.logger.error(error);
        process.exit(2);
      } else {
        throw error;
      }
    }

    return result;
  }

  getInfoOptions(): WebpackCLIBuiltInOption[] {
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
        hidden: true,
      },
      {
        name: "additional-package",
        alias: "a",
        configs: [{ type: "string" }],
        multiple: true,
        description: "Adds additional packages to the output",
        hidden: true,
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

    let defaultPackages: string[] = ["webpack", "loader"];

    if (typeof options.additionalPackage !== "undefined") {
      defaultPackages = [...defaultPackages, ...options.additionalPackage];
    }

    defaultInformation.npmPackages = `{${defaultPackages.map((item) => `*${item}*`).join(",")}}`;

    const envinfo = await this.tryRequireThenImport<typeof import("envinfo")>("envinfo", false);

    let info = await envinfo.run(defaultInformation, envinfoConfig);

    info = info.replace("npmPackages", "Packages");
    info = info.replace("npmGlobalPackages", "Global Packages");

    return info;
  }

  async makeCommand(commandOptions: WebpackCLIOptions): Promise<WebpackCLICommand | undefined> {
    const command = this.program.command(commandOptions.name, {
      hidden: commandOptions.hidden,
      isDefault: commandOptions.isDefault,
    }) as WebpackCLICommand;

    command.description(commandOptions.description);
    command.aliases(commandOptions.alias);

    if (commandOptions.options) {
      for (const option of commandOptions.options) {
        command.addOption(option);
      }
    }

    command.configureHelp({
      visibleOptions(cmd) {
        const showAll = cmd.args[command.args.indexOf("--help") + 1] === "verbose";
        return cmd.options.filter((opt) => !opt.hidden || showAll);
      },
    });

    if (commandOptions.dependencies && commandOptions.dependencies.length > 0) {
      for (const dependency of commandOptions.dependencies) {
        const isPkgExist = this.checkPackageExists(dependency);

        if (isPkgExist) {
          continue;
        }

        let skipInstallation = false;

        // Allow to use `./path/to/webpack.js` outside `node_modules`
        if (dependency === WEBPACK_PACKAGE && WEBPACK_PACKAGE_IS_CUSTOM) {
          skipInstallation = true;
        }

        // Allow to use `./path/to/webpack-dev-server.js` outside `node_modules`
        if (dependency === WEBPACK_DEV_SERVER_PACKAGE && WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM) {
          skipInstallation = true;
        }

        if (skipInstallation) {
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

    command.action(commandOptions.action);

    return command;
  }

  makeOption(option: WebpackCLIBuiltInOption): WebpackCLICommandOption[] {
    const options: WebpackCLICommandOption[] = [];
    const flagsWithAlias = ["devtool", "output-path", "target", "watch", "extends"];

    if (flagsWithAlias.includes(option.name)) {
      [option.alias] = option.name;
    }

    const mainOptionType: WebpackCLIMainOption["type"] = new Set();
    let needNegativeOption = false;
    let negatedDescription: string | undefined;

    // Determine option types and negative option needs
    if (option.configs) {
      for (const config of option.configs) {
        switch (config.type) {
          case "reset":
          case "boolean":
            mainOptionType.add(Boolean);
            if (!needNegativeOption && config.type === "boolean") {
              needNegativeOption = true;
              negatedDescription = config.negatedDescription;
            }
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
              if (typeof value === "string") {
                mainOptionType.add(String);
              } else if (typeof value === "number") {
                mainOptionType.add(Number);
              } else if (typeof value === "boolean") {
                if (value === false && !hasFalseEnum) {
                  hasFalseEnum = true;
                } else {
                  mainOptionType.add(Boolean);
                }
              }
            }
            if (!needNegativeOption && hasFalseEnum) {
              needNegativeOption = true;
              negatedDescription = config.negatedDescription;
            }
            break;
          }
        }
      }
    } else {
      const types = option.type
        ? Array.isArray(option.type)
          ? option.type
          : [option.type]
        : [Boolean];
      for (const type of types) mainOptionType.add(type);
      needNegativeOption = option.negative || false;
      negatedDescription = option.negatedDescription;
    }

    // Build main option flags
    const baseFlags = option.alias ? `-${option.alias}, --${option.name}` : `--${option.name}`;
    const valueName = option.valueName || "value";
    const multipleIndicator = option.multiple ? "..." : "";

    let flags = baseFlags;
    if (mainOptionType.size > 1 && mainOptionType.has(Boolean)) {
      flags = `${baseFlags} [${valueName}${multipleIndicator}]`;
    } else if (mainOptionType.size > 0 && !mainOptionType.has(Boolean)) {
      flags = `${baseFlags} <${valueName}${multipleIndicator}>`;
    }

    const description = option.description || "";

    // Create main option
    let mainOptionCommand: WebpackCLICommandOption;

    if (mainOptionType.size === 1) {
      mainOptionCommand = this.createSingleTypeOption(
        flags,
        description,
        mainOptionType,
        option.defaultValue,
        option.multiple,
      );
    } else if (mainOptionType.size > 1) {
      mainOptionCommand = this.createMultiTypeOption(
        flags,
        description,
        mainOptionType,
        option.defaultValue,
        option.multiple,
      );
    } else {
      mainOptionCommand = new Option(flags, description).default(option.defaultValue);
    }

    mainOptionCommand.hidden = option.hidden;
    options.push(mainOptionCommand);

    // Create negative option if needed
    if (needNegativeOption) {
      const negativeFlags = `--no-${option.name}`;
      const negativeDesc =
        negatedDescription || option.negatedDescription || `Negative '${option.name}' option. `;
      const negativeOptionCommand = new Option(negativeFlags, negativeDesc);
      negativeOptionCommand.hidden = option.hidden;
      options.push(negativeOptionCommand);
    }

    return options;
  }

  private createSingleTypeOption(
    flags: string,
    description: string,
    types: WebpackCLIMainOption["type"],
    defaultValue: unknown,
    multiple?: boolean,
  ): WebpackCLICommandOption {
    let skipDefault = true;

    if (types.has(Number)) {
      return new Option(flags, description)
        .argParser((value: string, prev = []) => {
          if (defaultValue && multiple && skipDefault) {
            prev = [];
            skipDefault = false;
          }
          return multiple ? [...prev, Number(value)] : Number(value);
        })
        .default(defaultValue);
    } else if (types.has(String)) {
      return new Option(flags, description)
        .argParser((value: string, prev = []) => {
          if (defaultValue && multiple && skipDefault) {
            prev = [];
            skipDefault = false;
          }
          return multiple ? [...prev, value] : value;
        })
        .default(defaultValue);
    } else if (types.has(Boolean)) {
      return new Option(flags, description).default(defaultValue);
    }
    return new Option(flags, description).argParser([...types][0]).default(defaultValue);
  }

  private createMultiTypeOption(
    flags: string,
    description: string,
    types: WebpackCLIMainOption["type"],
    defaultValue: unknown,
    multiple?: boolean,
  ): WebpackCLICommandOption {
    let skipDefault = true;

    return new Option(flags, description)
      .argParser((value: string, prev = []) => {
        if (defaultValue && multiple && skipDefault) {
          prev = [];
          skipDefault = false;
        }

        if (types.has(Number)) {
          const numberValue = Number(value);
          if (!Number.isNaN(numberValue)) {
            return multiple ? [...prev, numberValue] : numberValue;
          }
        }

        if (types.has(String)) {
          return multiple ? [...prev, value] : value;
        }

        return value;
      })
      .default(defaultValue);
  }

  getBuiltInOptions(): WebpackCLIBuiltInOption[] {
    if (this.builtInOptionsCache) {
      return this.builtInOptionsCache;
    }

    const builtInFlags: WebpackCLIBuiltInFlag[] = [
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
        hidden: true,
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
    let coreOptions: WebpackCLIBuiltInOption[] = [];
    if (this.webpack) {
      coreOptions = Object.entries(this.webpack.cli.getArguments()).map<WebpackCLIBuiltInOption>(
        ([name, meta]) => ({
          ...meta,
          name,
          description: meta.description,
          group: "core",
          hidden: !minimumHelpFlags.includes(name),
        }),
      );
    }
    const options = [...builtInFlags, ...coreOptions];

    this.builtInOptionsCache = options;

    return options;
  }

  async loadWebpack(handleError = true) {
    return this.tryRequireThenImport<typeof webpack>(WEBPACK_PACKAGE, handleError);
  }

  async run(args?: Parameters<WebpackCLICommand["parseOptions"]>[0], parseOptions?: ParseOptions) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const cli = this;

    // Load webpack early for getBuiltInOptions to access cli.getArguments()
    this.webpack = await this.loadWebpack();

    const options = this.getBuiltInOptions().flatMap((opt) => this.makeOption(opt));

    await this.makeCommand({
      name: "build [entries...]",
      alias: ["bundle", "b"],
      description: "Run webpack (default command, can be omitted).",
      dependencies: [WEBPACK_PACKAGE],
      isDefault: true,
      options,
      async action(this: WebpackCLICommand, entries, options) {
        if (
          this.parent!.args.length > 0 &&
          this.parent!.args[0] === this.args[0] &&
          !fs.existsSync(this.args[0])
        ) {
          // If we are running as default _and_ an entry cannot be found,
          // we should suggest alternative commands to the user.
          // @ts-expect-error It's a private method
          this.parent!.unknownCommand();
        }

        if (entries.length > 0) {
          options.entry = [...entries, ...(options.entry || [])];
        }

        await cli.runWebpack(options, false);
      },
    });

    await this.makeCommand({
      name: "watch [entries...]",
      alias: ["w"],
      description: "Run webpack and watch for files changes.",
      dependencies: [WEBPACK_PACKAGE],
      options,
      async action(entries, options) {
        if (entries.length > 0) {
          options.entry = [...entries, ...(options.entry || [])];
        }

        await cli.runWebpack(options, true);
      },
    });

    await this.makeCommand({
      name: "configtest [config-path]",
      alias: ["t"],
      description: "Validate a webpack configuration.",
      dependencies: [WEBPACK_PACKAGE],
      async action(configPath) {
        const config = await cli.loadConfig(configPath ? { config: [configPath] } : {});
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
          cli.logger.error("No configuration found.");
          process.exit(2);
        }

        cli.logger.info(`Validate '${[...configPaths].join(" ,")}'.`);

        try {
          cli.webpack.validate(config.options);
        } catch (error) {
          if (cli.isValidationError(error as Error)) {
            cli.logger.error((error as Error).message);
          } else {
            cli.logger.error(error);
          }

          process.exit(2);
        }

        cli.logger.success("There are no validation errors in the given webpack configuration.");
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let devServerArguments: any[] = [];
    try {
      const devServer = require(WEBPACK_DEV_SERVER_PACKAGE);

      devServerArguments = Object.entries(cli.webpack.cli.getArguments(devServer.schema)).map(
        ([name, option]) => ({ name, ...option, group: "core", hidden: true }),
      );
    } catch {
      // webpack-dev-server not available, continue with empty options
    }

    await this.makeCommand({
      name: "serve [entries...]",
      alias: ["server", "s"],
      description: "Run the webpack dev server and watch for source file changes while serving.",
      options: [...options, ...devServerArguments.flatMap((opt) => cli.makeOption(opt))],
      dependencies: [WEBPACK_PACKAGE, WEBPACK_DEV_SERVER_PACKAGE],
      async action(entries, options) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const webpackCLIOptions: Record<string, any> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const devServerCLIOptions: Record<string, any> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processors: ((opts: Record<string, any>) => void)[] = [];

        const builtinOptions = cli.getBuiltInOptions();

        for (const optionName in options) {
          const kebabedOption = cli.toKebabCase(optionName);
          const isBuiltInOption = builtinOptions.find((opt) => opt.name === kebabedOption);

          if (isBuiltInOption) {
            webpackCLIOptions[optionName] = options[optionName];
          } else {
            const needToProcess = devServerArguments.find(
              ({ processor, name }) => name === kebabedOption && processor,
            );

            if (needToProcess) {
              processors.push(needToProcess.processor);
            }

            devServerCLIOptions[optionName] = options[optionName];
          }
        }

        for (const processor of processors) {
          processor(devServerCLIOptions);
        }

        if (entries.length > 0) {
          webpackCLIOptions.entry = [...entries, ...(webpackCLIOptions.entry || [])];
        }

        webpackCLIOptions.argv = {
          ...options,
          env: { WEBPACK_SERVE: true, ...options.env },
        };

        webpackCLIOptions.isWatchingLikeCommand = true;

        const compiler = await cli.createCompiler(webpackCLIOptions);
        if (!compiler) return;

        const servers: (typeof DevServer)[] = [];

        if (cli.needWatchStdin(compiler)) {
          process.stdin.on("end", () => {
            Promise.all(servers.map((server) => server.stop())).then(() => {
              process.exit(0);
            });
          });
          process.stdin.resume();
        }

        const compilers = cli.isMultipleCompiler(compiler) ? compiler.compilers : [compiler];
        const possibleCompilers = compilers.filter(
          (compiler: Compiler) => compiler.options.devServer,
        );
        const devServerCompilers =
          possibleCompilers.length > 0
            ? possibleCompilers
            : compilers[0].options.devServer === false
              ? []
              : [compilers[0]];

        const usedPorts = new Set();

        const DevServer = require(WEBPACK_DEV_SERVER_PACKAGE);

        for (const devServerCompiler of devServerCompilers) {
          const result = { ...devServerCompiler.options.devServer } as WebpackDevServerOptions;
          cli.processArguments(result, options, devServerArguments);

          if (result.port) {
            if (usedPorts.has(result.port)) {
              throw new Error(
                "Unique ports must be specified for each devServer option in your webpack configuration. Alternatively, run only 1 devServer config using the --config-name flag to specify your desired config.",
              );
            }

            usedPorts.add(result.port);
          }

          try {
            const server = new DevServer(result, compiler);

            await server.start();

            servers.push(server);
          } catch (error) {
            if (cli.isValidationError(error as Error)) {
              cli.logger.error((error as Error).message);
            } else {
              cli.logger.error(error);
            }

            process.exit(2);
          }
        }

        if (servers.length === 0) {
          cli.logger.error("No dev server configurations to run");
          process.exit(2);
        }
      },
    });

    await this.makeCommand({
      name: "info",
      alias: ["i", "version"],
      description:
        "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
      options: this.getInfoOptions().flatMap((opt) => this.makeOption(opt)),
      async action(options) {
        const info = await cli.getInfoOutput(options);
        cli.logger.raw(info);
      },
    });

    this.program.option("--color", "Enable colors on console.");
    this.program.on("option:color", function color(this: WebpackCLICommand) {
      const { color } = this.opts();

      cli.isColorSupportChanged = color;
      cli.colors = cli.createColors(color);
    });

    this.program.option("--no-color", "Disable colors on console.");
    this.program.on("option:no-color", function noColor(this: WebpackCLICommand) {
      const { color } = this.opts();

      cli.isColorSupportChanged = color;
      cli.colors = cli.createColors(color);
    });

    await this.program.parseAsync(args, parseOptions);
  }

  async loadConfig(options: Partial<WebpackDevServerOptions>) {
    const disableInterpret =
      typeof options.disableInterpret !== "undefined" && options.disableInterpret;

    const interpret = require("interpret");

    const loadConfigByPath = async (
      configPath: string,
      argv: Argv = {},
    ): Promise<{ options: Configuration | Configuration[]; path: string }> => {
      const ext = path.extname(configPath).toLowerCase();
      let interpreted = Object.keys(interpret.jsVariants).find((variant) => variant === ext);
      // Fallback `.cts` to `.ts`
      // TODO implement good `.mts` support after https://github.com/gulpjs/rechoir/issues/43
      // For ESM and `.mts` you need to use: 'NODE_OPTIONS="--loader ts-node/esm" webpack-cli --config ./webpack.config.mts'
      if (!interpreted && ext.endsWith(".cts")) {
        interpreted = interpret.jsVariants[".ts"];
      }

      if (interpreted && !disableInterpret) {
        const rechoir: Rechoir = require("rechoir");

        try {
          rechoir.prepare(interpret.extensions, configPath);
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

      let options: LoadableWebpackConfiguration | LoadableWebpackConfiguration[];

      type LoadConfigOption = PotentialPromise<Configuration>;

      let moduleType: "unknown" | "commonjs" | "esm" = "unknown";

      switch (ext) {
        case ".cjs":
        case ".cts":
          moduleType = "commonjs";
          break;
        case ".mjs":
        case ".mts":
          moduleType = "esm";
          break;
      }

      try {
        options = await this.tryRequireThenImport<LoadConfigOption | LoadConfigOption[]>(
          configPath,
          false,
          moduleType,
        );
      } catch (error) {
        this.logger.error(`Failed to load '${configPath}' config`);

        if (this.isValidationError(error)) {
          this.logger.error(error.message);
        } else {
          this.logger.error(error);
        }

        process.exit(2);
      }

      if (!options) {
        this.logger.error(`Failed to load '${configPath}' config. Unable to find default export.`);
        process.exit(2);
      }

      if (Array.isArray(options)) {
        // reassign the value to assert type
        const optionsArray: LoadableWebpackConfiguration[] = options;
        await Promise.all(
          optionsArray.map(async (_, i) => {
            if (
              this.isPromise<Configuration | CallableWebpackConfiguration>(
                optionsArray[i] as Promise<Configuration | CallableWebpackConfiguration>,
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
        options = optionsArray;
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
        options: options as Configuration | Configuration[],
        path: configPath,
      };
    };

    const config: WebpackCLIConfig = {
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
        ["webpack.config", ".webpack/webpack.config", ".webpack/webpackfile"].flatMap((filename) =>
          [...extensions].map((ext) => path.resolve(filename + ext)),
        ),
      );

      let foundDefaultConfigFile;

      for (const defaultConfigFile of defaultConfigFiles) {
        if (!fs.existsSync(defaultConfigFile)) {
          continue;
        }

        foundDefaultConfigFile = defaultConfigFile;
        break;
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
      }) as Configuration[];

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
      configPaths: WebpackCLIConfig["path"],
      extendsPaths: string[],
    ): Promise<Configuration> => {
      delete config.extends;

      const loadedConfigs = await Promise.all(
        extendsPaths.map((extendsPath) =>
          loadConfigByPath(path.resolve(extendsPath), options.argv),
        ),
      );

      const merge = await this.tryRequireThenImport<typeof webpackMerge>("webpack-merge");
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
      const merge = await this.tryRequireThenImport<typeof webpackMerge>("webpack-merge");

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

  async processArguments(
    item: Configuration,
    userOptions: Partial<WebpackDevServerOptions>,
    optionsConfig: WebpackCLIBuiltInOption[] = this.getBuiltInOptions(),
  ) {
    // Apply options
    const args: Record<string, Argument> = optionsConfig.reduce(
      (accumulator: Record<string, Argument>, flag) => {
        if (flag.group === "core") {
          accumulator[flag.name] = flag as unknown as Argument;
        }
        return accumulator;
      },
      {},
    );
    const values: ProcessedArguments = Object.keys(userOptions).reduce(
      (accumulator: ProcessedArguments, name) => {
        if (name === "argv") {
          return accumulator;
        }

        const kebabName = this.toKebabCase(name);

        if (args[kebabName]) {
          accumulator[kebabName] = userOptions[name as keyof typeof userOptions as string];
        }

        return accumulator;
      },
      {},
    );

    if (Object.keys(values).length > 0) {
      const problems: Problem[] | null = this.webpack.cli.processArguments(args, item, values);

      if (problems) {
        const groupBy = <K extends keyof Problem & StringsKeys<Problem>>(xs: Problem[], key: K) =>
          xs.reduce((rv: Record<string, Problem[]>, problem: Problem) => {
            const path = problem[key];

            (rv[path] ||= []).push(problem);

            return rv;
          }, {});
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
  }

  async buildConfig(
    config: WebpackCLIConfig,
    options: Partial<WebpackDevServerOptions>,
  ): Promise<WebpackCLIConfig> {
    if (options.analyze && !this.checkPackageExists("webpack-bundle-analyzer")) {
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

    const CLIPlugin =
      await this.tryRequireThenImport<Instantiable<CLIPluginClass, [CLIPluginOptions]>>(
        "./plugins/cli-plugin",
      );

    const internalBuildConfig = (item: Configuration) => {
      const originalWatchValue = item.watch;

      this.processArguments(item, options);

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

      const isFileSystemCacheOptions = (config: Configuration): config is FileSystemCacheOptions =>
        Boolean(config.cache) && (config as FileSystemCacheOptions).cache.type === "filesystem";

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
    options: Partial<WebpackDevServerOptions>,
    callback?: WebpackCallback,
  ): Promise<WebpackCompiler> {
    if (typeof options.configNodeEnv === "string") {
      process.env.NODE_ENV = options.configNodeEnv;
    } else if (typeof options.nodeEnv === "string") {
      process.env.NODE_ENV = options.nodeEnv;
    }

    let config = await this.loadConfig(options);
    config = await this.buildConfig(config, options);

    let compiler: WebpackCompiler;

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

  async runWebpack(options: WebpackRunOptions, isWatchCommand: boolean): Promise<void> {
    let compiler: Compiler | MultiCompiler;
    let createStringifyChunked: typeof stringifyChunked;

    if (options.json) {
      const jsonExt = await this.tryRequireThenImport<JsonExt>("@discoveryjs/json-ext");

      createStringifyChunked = jsonExt.stringifyChunked;
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

      if (options.json && createStringifyChunked) {
        const handleWriteError = (error: WebpackError) => {
          this.logger.error(error);
          process.exit(2);
        };

        if (options.json === true) {
          Readable.from(createStringifyChunked(stats.toJson(statsOptions as StatsOptions)))
            .on("error", handleWriteError)
            .pipe(process.stdout)
            .on("error", handleWriteError)
            .on("close", () => process.stdout.write("\n"));
        } else {
          Readable.from(createStringifyChunked(stats.toJson(statsOptions as StatsOptions)))
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

    compiler = await this.createCompiler(options as WebpackDevServerOptions, callback);

    if (!compiler) {
      return;
    }

    const needGracefulShutdown = (compiler: WebpackCompiler): boolean =>
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

// TODO remove me in the next major release and use `default` export
module.exports = WebpackCLI;
