/* eslint-disable @typescript-eslint/no-var-requires */
import {
  IWebpackCLI,
  WebpackCLICommandOption,
  WebpackCLIBuiltInOption,
  WebpackCLIBuiltInFlag,
  WebpackCLIColors,
  WebpackCLIStats,
  WebpackCLIConfig,
  WebpackCLIExternalCommandInfo,
  WebpackCLIOptions,
  WebpackCLICommand,
  WebpackCLICommandOptions,
  WebpackCLIMainOption,
  WebpackCLILogger,
  WebpackV4LegacyStats,
  WebpackDevServerOptions,
  WebpackRunOptions,
  WebpackV4Compiler,
  WebpackCompiler,
  WebpackConfiguration,
  Argv,
  BasicPrimitive,
  BasicPackageJsonContent,
  CallableOption,
  Callback,
  CLIPluginOptions,
  CommandAction,
  ConfigOptions,
  DynamicImport,
  FileSystemCacheOptions,
  FlagConfig,
  ImportLoaderError,
  Instantiable,
  JsonExt,
  ModuleName,
  MultipleCompilerStatsOptions,
  PackageInstallOptions,
  PackageManager,
  Path,
  ProcessedArguments,
  PromptOptions,
  PotentialPromise,
  Rechoir,
  RechoirError,
  Argument,
  Problem,
} from "./types";

import webpackMerge from "webpack-merge";
import webpack from "webpack";
import { Compiler, MultiCompiler, WebpackError, StatsOptions } from "webpack";
import { stringifyStream } from "@discoveryjs/json-ext";
import { Help, ParseOptions } from "commander";

import { CLIPlugin as CLIPluginClass } from "./plugins/CLIPlugin";

const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const util = require("util");

const { program, Option } = require("commander");

const WEBPACK_PACKAGE = process.env.WEBPACK_PACKAGE || "webpack";
const WEBPACK_DEV_SERVER_PACKAGE = process.env.WEBPACK_DEV_SERVER_PACKAGE || "webpack-dev-server";

class WebpackCLI implements IWebpackCLI {
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
      writeErr: this.logger.error,
      outputError: (str, write) =>
        write(`Error: ${this.capitalizeFirstLetter(str.replace(/^error:/, "").trim())}`),
    });
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
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }

  createColors(useColor?: boolean): WebpackCLIColors {
    const { createColors, isColorSupported } = require("colorette");

    let shouldUseColor;

    if (useColor) {
      shouldUseColor = useColor;
    } else {
      shouldUseColor = isColorSupported;
    }

    return { ...createColors({ useColor: shouldUseColor }), isColorSupported: shouldUseColor };
  }

  getLogger(): WebpackCLILogger {
    return {
      error: (val) => console.error(`[webpack-cli] ${this.colors.red(util.format(val))}`),
      warn: (val) => console.warn(`[webpack-cli] ${this.colors.yellow(val)}`),
      info: (val) => console.info(`[webpack-cli] ${this.colors.cyan(val)}`),
      success: (val) => console.log(`[webpack-cli] ${this.colors.green(val)}`),
      log: (val) => console.log(`[webpack-cli] ${val}`),
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
      } catch (_error) {
        // Nothing
      }
    } while (dir !== (dir = path.dirname(dir)));

    return false;
  }

  getAvailablePackageManagers(): PackageManager[] {
    const { sync } = require("cross-spawn");
    const installers: PackageManager[] = ["npm", "yarn", "pnpm"];
    const hasPackageManagerInstalled = (packageManager: PackageManager) => {
      try {
        sync(packageManager, ["--version"]);

        return packageManager;
      } catch (err) {
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
    } catch (e) {
      // Nothing
    }

    try {
      // the sync function below will fail if yarn is not installed,
      // an error will be thrown
      if (sync("yarn", ["--version"])) {
        return "yarn";
      }
    } catch (e) {
      // Nothing
    }

    try {
      // the sync function below will fail if pnpm is not installed,
      // an error will be thrown
      if (sync("pnpm", ["--version"])) {
        return "pnpm";
      }
    } catch (e) {
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
      const readline = require("readline");
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

  async tryRequireThenImport<T>(module: ModuleName, handleError = true): Promise<T> {
    let result;

    try {
      result = require(module);
    } catch (error) {
      const dynamicImportLoader: null | DynamicImport<T> =
        require("./utils/dynamic-import-loader")();
      if (
        ((error as ImportLoaderError).code === "ERR_REQUIRE_ESM" ||
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

    // For babel/typescript
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

  async makeCommand(
    commandOptions: WebpackCLIOptions,
    options: WebpackCLICommandOptions,
    action: CommandAction,
  ): Promise<WebpackCLICommand | undefined> {
    const alreadyLoaded = this.program.commands.find(
      (command) =>
        command.name() === commandOptions.name.split(" ")[0] ||
        command.aliases().includes(commandOptions.alias as string),
    );

    if (alreadyLoaded) {
      return;
    }

    const command = this.program.command(commandOptions.name, {
      noHelp: commandOptions.noHelp,
      hidden: commandOptions.hidden,
      isDefault: commandOptions.isDefault,
    }) as WebpackCLICommand;

    if (commandOptions.description) {
      command.description(commandOptions.description, commandOptions.argsDescription);
    }

    if (commandOptions.usage) {
      command.usage(commandOptions.usage);
    }

    if (Array.isArray(commandOptions.alias)) {
      command.aliases(commandOptions.alias);
    } else {
      command.alias(commandOptions.alias as string);
    }

    if (commandOptions.pkg) {
      command.pkg = commandOptions.pkg;
    } else {
      command.pkg = "webpack-cli";
    }

    const { forHelp } = this.program;

    let allDependenciesInstalled = true;

    if (commandOptions.dependencies && commandOptions.dependencies.length > 0) {
      for (const dependency of commandOptions.dependencies) {
        const isPkgExist = this.checkPackageExists(dependency);

        if (isPkgExist) {
          continue;
        } else if (!isPkgExist && forHelp) {
          allDependenciesInstalled = false;
          continue;
        }

        let skipInstallation = false;

        // Allow to use `./path/to/webpack.js` outside `node_modules`
        if (dependency === WEBPACK_PACKAGE && fs.existsSync(WEBPACK_PACKAGE)) {
          skipInstallation = true;
        }

        // Allow to use `./path/to/webpack-dev-server.js` outside `node_modules`
        if (dependency === WEBPACK_DEV_SERVER_PACKAGE && fs.existsSync(WEBPACK_PACKAGE)) {
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

    if (options) {
      if (typeof options === "function") {
        if (forHelp && !allDependenciesInstalled && commandOptions.dependencies) {
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

      options.forEach((optionForCommand) => {
        this.makeOption(command, optionForCommand);
      });
    }

    command.action(action);

    return command;
  }

  makeOption(command: WebpackCLICommand, option: WebpackCLIBuiltInOption) {
    let mainOption: WebpackCLIMainOption;
    let negativeOption;

    if (option.configs) {
      let needNegativeOption = false;
      let negatedDescription;
      const mainOptionType: WebpackCLIMainOption["type"] = new Set();

      option.configs.forEach((config) => {
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

            const enumTypes = (config.values || []).map((value) => {
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
            });

            if (!needNegativeOption) {
              needNegativeOption = hasFalseEnum;
              negatedDescription = config.negatedDescription;
            }

            return enumTypes;
          }
        }
      });

      mainOption = {
        flags: option.alias ? `-${option.alias}, --${option.name}` : `--${option.name}`,
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
        // TODO `describe` used by `webpack-dev-server@3`
        description: option.description || option.describe || "",
        type: option.type
          ? new Set(Array.isArray(option.type) ? option.type : [option.type])
          : new Set([Boolean]),
        multiple: option.multiple,
        defaultValue: option.defaultValue,
      };

      if (option.negative) {
        negativeOption = {
          flags: `--no-${option.name}`,
          description: option.negatedDescription
            ? option.negatedDescription
            : `Negative '${option.name}' option.`,
        };
      }
    }

    if (mainOption.type.size > 1 && mainOption.type.has(Boolean)) {
      mainOption.flags = `${mainOption.flags} [value${mainOption.multiple ? "..." : ""}]`;
    } else if (mainOption.type.size > 0 && !mainOption.type.has(Boolean)) {
      mainOption.flags = `${mainOption.flags} <value${mainOption.multiple ? "..." : ""}>`;
    }

    if (mainOption.type.size === 1) {
      if (mainOption.type.has(Number)) {
        let skipDefault = true;

        const optionForCommand: WebpackCLICommandOption = new Option(
          mainOption.flags,
          mainOption.description,
        )
          .argParser((value: string, prev = []) => {
            if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
              prev = [];
              skipDefault = false;
            }

            return mainOption.multiple
              ? ([] as number[]).concat(prev).concat(Number(value))
              : Number(value);
          })
          .default(mainOption.defaultValue);

        optionForCommand.helpLevel = option.helpLevel;

        command.addOption(optionForCommand);
      } else if (mainOption.type.has(String)) {
        let skipDefault = true;

        const optionForCommand: WebpackCLICommandOption = new Option(
          mainOption.flags,
          mainOption.description,
        )
          .argParser((value: string, prev = []) => {
            if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
              prev = [];
              skipDefault = false;
            }

            return mainOption.multiple ? ([] as string[]).concat(prev).concat(value) : value;
          })
          .default(mainOption.defaultValue);

        optionForCommand.helpLevel = option.helpLevel;

        command.addOption(optionForCommand);
      } else if (mainOption.type.has(Boolean)) {
        const optionForCommand = new Option(mainOption.flags, mainOption.description).default(
          mainOption.defaultValue,
        );

        optionForCommand.helpLevel = option.helpLevel;

        command.addOption(optionForCommand);
      } else {
        const optionForCommand = new Option(mainOption.flags, mainOption.description)
          .argParser(Array.from(mainOption.type)[0])
          .default(mainOption.defaultValue);

        optionForCommand.helpLevel = option.helpLevel;

        command.addOption(optionForCommand);
      }
    } else if (mainOption.type.size > 1) {
      let skipDefault = true;

      const optionForCommand = new Option(
        mainOption.flags,
        mainOption.description,
        mainOption.defaultValue,
      )
        .argParser((value: string, prev = []) => {
          if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
            prev = [];
            skipDefault = false;
          }

          if (mainOption.type.has(Number)) {
            const numberValue = Number(value);

            if (!isNaN(numberValue)) {
              return mainOption.multiple
                ? ([] as number[]).concat(prev).concat(numberValue)
                : numberValue;
            }
          }

          if (mainOption.type.has(String)) {
            return mainOption.multiple ? ([] as string[]).concat(prev).concat(value) : value;
          }

          return value;
        })
        .default(mainOption.defaultValue);

      optionForCommand.helpLevel = option.helpLevel;

      command.addOption(optionForCommand);
    } else if (mainOption.type.size === 0 && negativeOption) {
      const optionForCommand = new Option(mainOption.flags, mainOption.description);

      // Hide stub option
      optionForCommand.hideHelp();
      optionForCommand.helpLevel = option.helpLevel;

      command.addOption(optionForCommand);
    }

    if (negativeOption) {
      const optionForCommand = new Option(negativeOption.flags, negativeOption.description);

      optionForCommand.helpLevel = option.helpLevel;

      command.addOption(optionForCommand);
    }
  }

  getBuiltInOptions(): WebpackCLIBuiltInOption[] {
    if (this.builtInOptionsCache) {
      return this.builtInOptionsCache;
    }

    const minimumHelpFlags = [
      "config",
      "config-name",
      "merge",
      "env",
      "mode",
      "watch",
      "watch-options-stdin",
      "stats",
      "devtool",
      "entry",
      "target",
      "progress",
      "json",
      "name",
      "output-path",
      "node-env",
    ];

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
        description: "Provide path to a webpack configuration file e.g. ./webpack.config.js.",
      },
      {
        name: "config-name",
        configs: [
          {
            type: "string",
          },
        ],
        multiple: true,
        description: "Name of the configuration to use.",
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
      },
      // Complex configs
      {
        name: "env",
        type: (
          value: string,
          previous: Record<string, BasicPrimitive | object> = {},
        ): Record<string, BasicPrimitive | object> => {
          // for https://github.com/webpack/webpack-cli/issues/2642
          if (value.endsWith("=")) {
            value.concat('""');
          }

          // This ensures we're only splitting by the first `=`
          const [allKeys, val] = value.split(/=(.+)/, 2);
          const splitKeys = allKeys.split(/\.(?!$)/);

          let prevRef = previous;

          splitKeys.forEach((someKey, index) => {
            if (!prevRef[someKey]) {
              prevRef[someKey] = {};
            }

            if (typeof prevRef[someKey] === "string") {
              prevRef[someKey] = {};
            }

            if (index === splitKeys.length - 1) {
              if (typeof val === "string") {
                prevRef[someKey] = val;
              } else {
                prevRef[someKey] = true;
              }
            }

            prevRef = prevRef[someKey] as Record<string, string | object | boolean>;
          });

          return previous;
        },
        multiple: true,
        description: "Environment passed to the configuration when it is a function.",
      },
      {
        name: "node-env",
        configs: [
          {
            type: "string",
          },
        ],
        multiple: false,
        description: "Sets process.env.NODE_ENV to the specified value.",
      },

      // Adding more plugins
      {
        name: "hot",
        alias: "h",
        configs: [
          {
            type: "string",
          },
          {
            type: "boolean",
          },
        ],
        negative: true,
        description: "Enables Hot Module Replacement",
        negatedDescription: "Disables Hot Module Replacement.",
      },
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
      },
      {
        name: "prefetch",
        configs: [
          {
            type: "string",
          },
        ],
        description: "Prefetch this request.",
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
        description: "Prints result as JSON or store it in a file.",
      },

      // For webpack@4
      {
        name: "entry",
        configs: [
          {
            type: "string",
          },
        ],
        multiple: true,
        description: "The entry point(s) of your application e.g. ./src/main.js.",
      },
      {
        name: "output-path",
        alias: "o",
        configs: [
          {
            type: "string",
          },
        ],
        description: "Output location of the file generated by webpack e.g. ./dist/.",
      },
      {
        name: "target",
        alias: "t",
        configs: [
          {
            type: "string",
          },
        ],
        multiple: this.webpack.cli !== undefined,
        description: "Sets the build target e.g. node.",
      },
      {
        name: "devtool",
        configs: [
          {
            type: "string",
          },
          {
            type: "enum",
            values: [false],
          },
        ],
        negative: true,
        alias: "d",
        description: "Determine source maps to use.",
        negatedDescription: "Do not generate source maps.",
      },
      {
        name: "mode",
        configs: [
          {
            type: "string",
          },
        ],
        description: "Defines the mode to pass to webpack.",
      },
      {
        name: "name",
        configs: [
          {
            type: "string",
          },
        ],
        description: "Name of the configuration. Used when loading multiple configurations.",
      },
      {
        name: "stats",
        configs: [
          {
            type: "string",
          },
          {
            type: "boolean",
          },
        ],
        negative: true,
        description: "It instructs webpack on how to treat the stats e.g. verbose.",
        negatedDescription: "Disable stats output.",
      },
      {
        name: "watch",
        configs: [
          {
            type: "boolean",
          },
        ],
        negative: true,
        alias: "w",
        description: "Watch for files changes.",
        negatedDescription: "Do not watch for file changes.",
      },
      {
        name: "watch-options-stdin",
        configs: [
          {
            type: "boolean",
          },
        ],
        negative: true,
        description: "Stop watching when stdin stream has ended.",
        negatedDescription: "Do not stop watching when stdin stream has ended.",
      },
    ];

    // Extract all the flags being exported from core.
    // A list of cli flags generated by core can be found here https://github.com/webpack/webpack/blob/master/test/__snapshots__/Cli.test.js.snap
    const coreFlags = this.webpack.cli
      ? Object.entries(this.webpack.cli.getArguments()).map(([flag, meta]) => {
          const inBuiltIn = builtInFlags.find((builtInFlag) => builtInFlag.name === flag);

          if (inBuiltIn) {
            return {
              ...meta,
              // @ts-expect-error this might be overwritten
              name: flag,
              group: "core",
              ...inBuiltIn,
              configs: meta.configs || [],
            };
          }

          return { ...meta, name: flag, group: "core" };
        })
      : [];

    const options: WebpackCLIBuiltInOption[] = ([] as WebpackCLIBuiltInFlag[])
      .concat(
        builtInFlags.filter(
          (builtInFlag) => !coreFlags.find((coreFlag) => builtInFlag.name === coreFlag.name),
        ),
      )
      .concat(coreFlags)
      .map((option): WebpackCLIBuiltInOption => {
        (option as WebpackCLIBuiltInOption).helpLevel = minimumHelpFlags.includes(option.name)
          ? "minimum"
          : "verbose";
        return option as WebpackCLIBuiltInOption;
      });

    this.builtInOptionsCache = options;

    return options;
  }

  async loadWebpack(handleError = true) {
    return this.tryRequireThenImport<typeof webpack>(WEBPACK_PACKAGE, handleError);
  }

  async run(args: Parameters<WebpackCLICommand["parseOptions"]>[0], parseOptions: ParseOptions) {
    // Built-in internal commands
    const buildCommandOptions = {
      name: "build [entries...]",
      alias: ["bundle", "b"],
      description: "Run webpack (default command, can be omitted).",
      usage: "[entries...] [options]",
      dependencies: [WEBPACK_PACKAGE],
    };
    const watchCommandOptions = {
      name: "watch [entries...]",
      alias: "w",
      description: "Run webpack and watch for files changes.",
      usage: "[entries...] [options]",
      dependencies: [WEBPACK_PACKAGE],
    };
    const versionCommandOptions = {
      name: "version [commands...]",
      alias: "v",
      description:
        "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
    };
    const helpCommandOptions = {
      name: "help [command] [option]",
      alias: "h",
      description: "Display help for commands and options.",
    };
    // Built-in external commands
    const externalBuiltInCommandsInfo: WebpackCLIExternalCommandInfo[] = [
      {
        name: "serve [entries...]",
        alias: ["server", "s"],
        pkg: "@webpack-cli/serve",
      },
      {
        name: "info",
        alias: "i",
        pkg: "@webpack-cli/info",
      },
      {
        name: "init",
        alias: ["create", "new", "c", "n"],
        pkg: "@webpack-cli/generators",
      },
      {
        name: "loader",
        alias: "l",
        pkg: "@webpack-cli/generators",
      },
      {
        name: "plugin",
        alias: "p",
        pkg: "@webpack-cli/generators",
      },
      {
        name: "migrate",
        alias: "m",
        pkg: "@webpack-cli/migrate",
      },
      {
        name: "configtest [config-path]",
        alias: "t",
        pkg: "@webpack-cli/configtest",
      },
    ];

    const knownCommands = [
      buildCommandOptions,
      watchCommandOptions,
      versionCommandOptions,
      helpCommandOptions,
      ...externalBuiltInCommandsInfo,
    ];
    const getCommandName = (name: string) => name.split(" ")[0];
    const isKnownCommand = (name: string) =>
      knownCommands.find(
        (command) =>
          getCommandName(command.name) === name ||
          (Array.isArray(command.alias) ? command.alias.includes(name) : command.alias === name),
      );
    const isCommand = (input: string, commandOptions: WebpackCLIOptions) => {
      const longName = getCommandName(commandOptions.name);

      if (input === longName) {
        return true;
      }

      if (commandOptions.alias) {
        if (Array.isArray(commandOptions.alias)) {
          return commandOptions.alias.includes(input);
        } else {
          return commandOptions.alias === input;
        }
      }

      return false;
    };
    const findCommandByName = (name: string) =>
      this.program.commands.find(
        (command) => name === command.name() || command.aliases().includes(name),
      );
    const isOption = (value: string): boolean => value.startsWith("-");
    const isGlobalOption = (value: string) =>
      value === "--color" ||
      value === "--no-color" ||
      value === "-v" ||
      value === "--version" ||
      value === "-h" ||
      value === "--help";

    const loadCommandByName = async (
      commandName: WebpackCLIExternalCommandInfo["name"],
      allowToInstall = false,
    ) => {
      const isBuildCommandUsed = isCommand(commandName, buildCommandOptions);
      const isWatchCommandUsed = isCommand(commandName, watchCommandOptions);

      if (isBuildCommandUsed || isWatchCommandUsed) {
        await this.makeCommand(
          isBuildCommandUsed ? buildCommandOptions : watchCommandOptions,
          async () => {
            this.webpack = await this.loadWebpack();

            return isWatchCommandUsed
              ? this.getBuiltInOptions().filter((option) => option.name !== "watch")
              : this.getBuiltInOptions();
          },
          async (entries, options) => {
            if (entries.length > 0) {
              options.entry = [...entries, ...(options.entry || [])];
            }

            await this.runWebpack(options, isWatchCommandUsed);
          },
        );
      } else if (isCommand(commandName, helpCommandOptions)) {
        // Stub for the `help` command
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.makeCommand(helpCommandOptions, [], () => {});
      } else if (isCommand(commandName, versionCommandOptions)) {
        // Stub for the `version` command
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.makeCommand(versionCommandOptions, [], () => {});
      } else {
        const builtInExternalCommandInfo = externalBuiltInCommandsInfo.find(
          (externalBuiltInCommandInfo) =>
            getCommandName(externalBuiltInCommandInfo.name) === commandName ||
            (Array.isArray(externalBuiltInCommandInfo.alias)
              ? externalBuiltInCommandInfo.alias.includes(commandName)
              : externalBuiltInCommandInfo.alias === commandName),
        );

        let pkg: string;

        if (builtInExternalCommandInfo) {
          ({ pkg } = builtInExternalCommandInfo);
        } else {
          pkg = commandName;
        }

        if (pkg !== "webpack-cli" && !this.checkPackageExists(pkg)) {
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

        let loadedCommand;

        try {
          loadedCommand = await this.tryRequireThenImport<Instantiable<() => void>>(pkg, false);
        } catch (error) {
          // Ignore, command is not installed

          return;
        }

        let command;

        try {
          command = new loadedCommand();

          await command.apply(this);
        } catch (error) {
          this.logger.error(`Unable to load '${pkg}' command`);
          this.logger.error(error);
          process.exit(2);
        }
      }
    };

    // Register own exit
    this.program.exitOverride(async (error) => {
      if (error.exitCode === 0) {
        process.exit(0);
      }

      if (error.code === "executeSubCommandAsync") {
        process.exit(2);
      }

      if (error.code === "commander.help") {
        process.exit(0);
      }

      if (error.code === "commander.unknownOption") {
        let name = error.message.match(/'(.+)'/) as string | null;

        if (name) {
          name = name[1].slice(2);

          if (name.includes("=")) {
            name = name.split("=")[0];
          }

          const { operands } = this.program.parseOptions(this.program.args);
          const operand =
            typeof operands[0] !== "undefined"
              ? operands[0]
              : getCommandName(buildCommandOptions.name);

          if (operand) {
            const command = findCommandByName(operand);

            if (!command) {
              this.logger.error(`Can't find and load command '${operand}'`);
              this.logger.error("Run 'webpack --help' to see available commands and options");
              process.exit(2);
            }

            const levenshtein = require("fastest-levenshtein");

            (command as WebpackCLICommand).options.forEach((option) => {
              if (!option.hidden && levenshtein.distance(name, option.long?.slice(2)) < 3) {
                this.logger.error(`Did you mean '--${option.name()}'?`);
              }
            });
          }
        }
      }

      // Codes:
      // - commander.unknownCommand
      // - commander.missingArgument
      // - commander.missingMandatoryOptionValue
      // - commander.optionMissingArgument

      this.logger.error("Run 'webpack --help' to see available commands and options");
      process.exit(2);
    });

    // Default `--color` and `--no-color` options
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const cli: IWebpackCLI = this;
    this.program.option("--color", "Enable colors on console.");
    this.program.on("option:color", function () {
      // @ts-expect-error shadowing 'this' is intended
      const { color } = this.opts();

      cli.isColorSupportChanged = color;
      cli.colors = cli.createColors(color);
    });
    this.program.option("--no-color", "Disable colors on console.");
    this.program.on("option:no-color", function () {
      // @ts-expect-error shadowing 'this' is intended
      const { color } = this.opts();

      cli.isColorSupportChanged = color;
      cli.colors = cli.createColors(color);
    });

    // Make `-v, --version` options
    // Make `version|v [commands...]` command
    const outputVersion = async (options: string[]) => {
      // Filter `bundle`, `watch`, `version` and `help` commands
      const possibleCommandNames = options.filter(
        (option) =>
          !isCommand(option, buildCommandOptions) &&
          !isCommand(option, watchCommandOptions) &&
          !isCommand(option, versionCommandOptions) &&
          !isCommand(option, helpCommandOptions),
      );

      possibleCommandNames.forEach((possibleCommandName) => {
        if (!isOption(possibleCommandName)) {
          return;
        }

        this.logger.error(`Unknown option '${possibleCommandName}'`);
        this.logger.error("Run 'webpack --help' to see available commands and options");
        process.exit(2);
      });

      if (possibleCommandNames.length > 0) {
        await Promise.all(
          possibleCommandNames.map((possibleCommand) => loadCommandByName(possibleCommand)),
        );

        for (const possibleCommandName of possibleCommandNames) {
          const foundCommand = findCommandByName(possibleCommandName) as WebpackCLICommand;

          if (!foundCommand) {
            this.logger.error(`Unknown command '${possibleCommandName}'`);
            this.logger.error("Run 'webpack --help' to see available commands and options");
            process.exit(2);
          }

          try {
            const { name, version } = this.loadJSONFile<BasicPackageJsonContent>(
              `${foundCommand.pkg}/package.json`,
            );

            this.logger.raw(`${name} ${version}`);
          } catch (e) {
            this.logger.error(`Error: External package '${foundCommand.pkg}' not found`);
            process.exit(2);
          }
        }
      }

      let webpack;

      try {
        webpack = await this.loadWebpack(false);
      } catch (_error) {
        // Nothing
      }

      this.logger.raw(`webpack: ${webpack ? webpack.version : "not installed"}`);

      const pkgJSON = this.loadJSONFile<BasicPackageJsonContent>("../package.json");

      this.logger.raw(`webpack-cli: ${pkgJSON.version}`);

      let devServer;

      try {
        devServer = await this.loadJSONFile<BasicPackageJsonContent>(
          "webpack-dev-server/package.json",
          false,
        );
      } catch (_error) {
        // Nothing
      }

      this.logger.raw(`webpack-dev-server ${devServer ? devServer.version : "not installed"}`);

      process.exit(0);
    };
    this.program.option(
      "-v, --version",
      "Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
    );

    const outputHelp = async (
      options: string[],
      isVerbose: boolean,
      isHelpCommandSyntax: boolean,
      program: WebpackCLICommand,
    ) => {
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
          commandUsage: (command: WebpackCLICommand) => {
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
          subcommandTerm: (command: WebpackCLICommand) => {
            const humanReadableArgumentName = (argument: WebpackCLICommandOption) => {
              const nameOutput = argument.name + (argument.variadic === true ? "..." : "");

              return argument.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
            };
            const args = command._args
              .map((arg: WebpackCLICommandOption) => humanReadableArgumentName(arg))
              .join(" ");

            return `${command.name()}|${command.aliases().join("|")}${args ? ` ${args}` : ""}${
              command.options.length > 0 ? " [options]" : ""
            }`;
          },
          visibleOptions: function visibleOptions(
            command: WebpackCLICommand,
          ): WebpackCLICommandOption[] {
            return command.options.filter((option: WebpackCLICommandOption) => {
              if (option.hidden) {
                return false;
              }

              switch (option.helpLevel) {
                case "verbose":
                  return isVerbose;
                case "minimum":
                default:
                  return true;
              }
            });
          },
          padWidth(command: WebpackCLICommand, helper: Help) {
            return Math.max(
              helper.longestArgumentTermLength(command, helper),
              helper.longestOptionTermLength(command, helper),
              // For global options
              helper.longestOptionTermLength(program, helper),
              helper.longestSubcommandTermLength(isGlobalHelp ? program : command, helper),
            );
          },
          formatHelp: (command: WebpackCLICommand, helper: Help) => {
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
              textArray.join("\n").replace(/^/gm, " ".repeat(itemIndentWidth));

            // Usage
            let output = [`${bold("Usage:")} ${helper.commandUsage(command)}`, ""];

            // Description
            const commandDescription = isGlobalHelp
              ? "The build tool for modern web applications."
              : helper.commandDescription(command);

            if (commandDescription.length > 0) {
              output = output.concat([commandDescription, ""]);
            }

            // Arguments
            const argumentList = helper
              .visibleArguments(command)
              .map((argument) => formatItem(argument.term, argument.description));

            if (argumentList.length > 0) {
              output = output.concat([bold("Arguments:"), formatList(argumentList), ""]);
            }

            // Options
            const optionList = helper
              .visibleOptions(command)
              .map((option) =>
                formatItem(helper.optionTerm(option), helper.optionDescription(option)),
              );

            if (optionList.length > 0) {
              output = output.concat([bold("Options:"), formatList(optionList), ""]);
            }

            // Global options
            const globalOptionList = program.options.map((option: WebpackCLICommandOption) =>
              formatItem(helper.optionTerm(option), helper.optionDescription(option)),
            );

            if (globalOptionList.length > 0) {
              output = output.concat([bold("Global options:"), formatList(globalOptionList), ""]);
            }

            // Commands
            const commandList = helper
              .visibleCommands(isGlobalHelp ? program : command)
              .map((command) =>
                formatItem(helper.subcommandTerm(command), helper.subcommandDescription(command)),
              );

            if (commandList.length > 0) {
              output = output.concat([bold("Commands:"), formatList(commandList), ""]);
            }

            return output.join("\n");
          },
        });

        if (isGlobalHelp) {
          await Promise.all(
            knownCommands.map((knownCommand) => {
              return loadCommandByName(getCommandName(knownCommand.name));
            }),
          );

          const buildCommand = findCommandByName(getCommandName(buildCommandOptions.name));

          buildCommand && this.logger.raw(buildCommand.helpInformation());
        } else {
          const name = options[0];

          await loadCommandByName(name);

          const command = findCommandByName(name);

          if (!command) {
            const builtInCommandUsed = externalBuiltInCommandsInfo.find(
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
        let commandName = getCommandName(buildCommandOptions.name);
        let optionName = "";

        if (options.length === 1) {
          optionName = options[0];
        } else if (options.length === 2) {
          isCommandSpecified = true;
          commandName = options[0];
          optionName = options[1];

          if (isOption(commandName)) {
            outputIncorrectUsageOfHelp();
          }
        } else {
          outputIncorrectUsageOfHelp();
        }

        await loadCommandByName(commandName);

        const command = isGlobalOption(optionName) ? program : findCommandByName(commandName);

        if (!command) {
          this.logger.error(`Can't find and load command '${commandName}'`);
          this.logger.error("Run 'webpack --help' to see available commands and options");
          process.exit(2);
        }

        const option = (command as WebpackCLICommand).options.find(
          (option) => option.short === optionName || option.long === optionName,
        );

        if (!option) {
          this.logger.error(`Unknown option '${optionName}'`);
          this.logger.error("Run 'webpack --help' to see available commands and options");
          process.exit(2);
        }

        const nameOutput =
          option.flags.replace(/^.+[[<]/, "").replace(/(\.\.\.)?[\]>].*$/, "") +
          (option.variadic === true ? "..." : "");
        const value = option.required
          ? "<" + nameOutput + ">"
          : option.optional
          ? "[" + nameOutput + "]"
          : "";

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

        if (flag && flag.configs) {
          const possibleValues = flag.configs.reduce((accumulator, currentValue) => {
            if (currentValue.values) {
              return accumulator.concat(currentValue.values);
            } else {
              return accumulator;
            }
          }, <FlagConfig["values"]>[]);

          if (possibleValues.length > 0) {
            this.logger.raw(
              `${bold("Possible values:")} ${JSON.stringify(possibleValues.join(" | "))}`,
            );
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
    };
    this.program.helpOption(false);
    this.program.addHelpCommand(false);
    this.program.option("-h, --help [verbose]", "Display help for commands and options.");

    let isInternalActionCalled = false;

    // Default action
    this.program.usage("[options]");
    this.program.allowUnknownOption(true);
    this.program.action(async (options, program: WebpackCLICommand) => {
      if (!isInternalActionCalled) {
        isInternalActionCalled = true;
      } else {
        this.logger.error("No commands found to run");
        process.exit(2);
      }

      // Command and options
      const { operands, unknown } = this.program.parseOptions(program.args);
      const defaultCommandToRun = getCommandName(buildCommandOptions.name);
      const hasOperand = typeof operands[0] !== "undefined";
      const operand = hasOperand ? operands[0] : defaultCommandToRun;
      const isHelpOption = typeof options.help !== "undefined";
      const isHelpCommandSyntax = isCommand(operand, helpCommandOptions);

      if (isHelpOption || isHelpCommandSyntax) {
        let isVerbose = false;

        if (isHelpOption) {
          if (typeof options.help === "string") {
            if (options.help !== "verbose") {
              this.logger.error("Unknown value for '--help' option, please use '--help=verbose'");
              process.exit(2);
            }

            isVerbose = true;
          }
        }

        this.program.forHelp = true;

        const optionsForHelp = ([] as string[])
          .concat(isHelpOption && hasOperand ? [operand] : [])
          // Syntax `webpack help [command]`
          .concat(operands.slice(1))
          // Syntax `webpack help [option]`
          .concat(unknown)
          .concat(
            isHelpCommandSyntax && typeof options.color !== "undefined"
              ? [options.color ? "--color" : "--no-color"]
              : [],
          )
          .concat(
            isHelpCommandSyntax && typeof options.version !== "undefined" ? ["--version"] : [],
          );

        await outputHelp(optionsForHelp, isVerbose, isHelpCommandSyntax, program);
      }

      const isVersionOption = typeof options.version !== "undefined";
      const isVersionCommandSyntax = isCommand(operand, versionCommandOptions);

      if (isVersionOption || isVersionCommandSyntax) {
        const optionsForVersion = ([] as string[])
          .concat(isVersionOption ? [operand] : [])
          .concat(operands.slice(1))
          .concat(unknown);

        await outputVersion(optionsForVersion);
      }

      let commandToRun = operand;
      let commandOperands = operands.slice(1);

      if (isKnownCommand(commandToRun)) {
        await loadCommandByName(commandToRun, true);
      } else {
        const isEntrySyntax = fs.existsSync(operand);

        if (isEntrySyntax) {
          commandToRun = defaultCommandToRun;
          commandOperands = operands;

          await loadCommandByName(commandToRun);
        } else {
          this.logger.error(`Unknown command or entry '${operand}'`);

          const levenshtein = require("fastest-levenshtein");
          const found = knownCommands.find(
            (commandOptions) =>
              levenshtein.distance(operand, getCommandName(commandOptions.name)) < 3,
          );

          if (found) {
            this.logger.error(
              `Did you mean '${getCommandName(found.name)}' (alias '${
                Array.isArray(found.alias) ? found.alias.join(", ") : found.alias
              }')?`,
            );
          }

          this.logger.error("Run 'webpack --help' to see available commands and options");
          process.exit(2);
        }
      }

      await this.program.parseAsync([commandToRun, ...commandOperands, ...unknown], {
        from: "user",
      });
    });

    await this.program.parseAsync(args, parseOptions);
  }

  async loadConfig(options: Partial<WebpackDevServerOptions>) {
    const interpret = require("interpret");
    const loadConfigByPath = async (configPath: string, argv: Argv = {}) => {
      const ext = path.extname(configPath);
      const interpreted = Object.keys(interpret.jsVariants).find((variant) => variant === ext);

      if (interpreted) {
        const rechoir: Rechoir = require("rechoir");

        try {
          rechoir.prepare(interpret.extensions, configPath);
        } catch (error) {
          if ((error as RechoirError)?.failures) {
            this.logger.error(`Unable load '${configPath}'`);
            this.logger.error((error as RechoirError).message);
            (error as RechoirError).failures.forEach((failure) => {
              this.logger.error(failure.error.message);
            });
            this.logger.error("Please install one of them");
            process.exit(2);
          }

          this.logger.error(error);
          process.exit(2);
        }
      }

      let options: ConfigOptions | ConfigOptions[];

      type LoadConfigOption = PotentialPromise<WebpackConfiguration>;

      try {
        options = await this.tryRequireThenImport<LoadConfigOption | LoadConfigOption[]>(
          configPath,
          false,
        );
        // @ts-expect-error error type assertion
      } catch (error: Error) {
        this.logger.error(`Failed to load '${configPath}' config`);

        if (this.isValidationError(error)) {
          this.logger.error(error.message);
        } else {
          this.logger.error(error);
        }

        process.exit(2);
      }

      if (Array.isArray(options)) {
        // reassign the value to assert type
        const optionsArray: ConfigOptions[] = options;
        await Promise.all(
          optionsArray.map(async (_, i) => {
            if (
              this.isPromise<WebpackConfiguration | CallableOption>(
                optionsArray[i] as Promise<WebpackConfiguration | CallableOption>,
              )
            ) {
              optionsArray[i] = await optionsArray[i];
            }
            // `Promise` may return `Function`
            if (this.isFunction(optionsArray[i])) {
              // when config is a function, pass the env from args to the config function
              optionsArray[i] = await (optionsArray[i] as CallableOption)(argv.env, argv);
            }
          }),
        );
        options = optionsArray;
      } else {
        if (this.isPromise<ConfigOptions>(options as Promise<ConfigOptions>)) {
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

      return { options, path: configPath };
    };

    const config: WebpackCLIConfig = {
      options: {} as WebpackConfiguration,
      path: new WeakMap(),
    };

    if (options.config && options.config.length > 0) {
      const loadedConfigs = await Promise.all(
        options.config.map((configPath: string) =>
          loadConfigByPath(path.resolve(configPath), options.argv),
        ),
      );

      config.options = [];

      loadedConfigs.forEach((loadedConfig) => {
        const isArray = Array.isArray(loadedConfig.options);

        // TODO we should run webpack multiple times when the `--config` options have multiple values with `--merge`, need to solve for the next major release
        if ((config.options as ConfigOptions[]).length === 0) {
          config.options = loadedConfig.options as WebpackConfiguration;
        } else {
          if (!Array.isArray(config.options)) {
            config.options = [config.options];
          }

          if (isArray) {
            (loadedConfig.options as ConfigOptions[]).forEach((item) => {
              (config.options as ConfigOptions[]).push(item);
            });
          } else {
            config.options.push(loadedConfig.options as WebpackConfiguration);
          }
        }

        if (isArray) {
          (loadedConfig.options as ConfigOptions[]).forEach((options) => {
            config.path.set(options, loadedConfig.path);
          });
        } else {
          config.path.set(loadedConfig.options, loadedConfig.path);
        }
      });

      config.options = config.options.length === 1 ? config.options[0] : config.options;
    } else {
      // Order defines the priority, in decreasing order
      const defaultConfigFiles = [
        "webpack.config",
        ".webpack/webpack.config",
        ".webpack/webpackfile",
      ]
        .map((filename) =>
          // Since .cjs is not available on interpret side add it manually to default config extension list
          [...Object.keys(interpret.extensions), ".cjs"].map((ext) => ({
            path: path.resolve(filename + ext),
            ext: ext,
            module: interpret.extensions[ext],
          })),
        )
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);

      let foundDefaultConfigFile;

      for (const defaultConfigFile of defaultConfigFiles) {
        if (!fs.existsSync(defaultConfigFile.path)) {
          continue;
        }

        foundDefaultConfigFile = defaultConfigFile;
        break;
      }

      if (foundDefaultConfigFile) {
        const loadedConfig = await loadConfigByPath(foundDefaultConfigFile.path, options.argv);

        config.options = loadedConfig.options as WebpackConfiguration[];

        if (Array.isArray(config.options)) {
          config.options.forEach((item) => {
            config.path.set(item, loadedConfig.path);
          });
        } else {
          config.path.set(loadedConfig.options, loadedConfig.path);
        }
      }
    }

    if (options.configName) {
      const notFoundConfigNames: string[] = [];

      config.options = options.configName.map((configName: string) => {
        let found;

        if (Array.isArray(config.options)) {
          found = config.options.find((options) => options.name === configName);
        } else {
          found = config.options.name === configName ? config.options : undefined;
        }

        if (!found) {
          notFoundConfigNames.push(configName);
        }

        return found;
      }) as WebpackConfiguration[];

      if (notFoundConfigNames.length > 0) {
        this.logger.error(
          notFoundConfigNames
            .map((configName) => `Configuration with the name "${configName}" was not found.`)
            .join(" "),
        );
        process.exit(2);
      }
    }

    if (options.merge) {
      const merge = await this.tryRequireThenImport<typeof webpackMerge>("webpack-merge");

      // we can only merge when there are multiple configurations
      // either by passing multiple configs by flags or passing a
      // single config exporting an array
      if (!Array.isArray(config.options) || config.options.length <= 1) {
        this.logger.error("At least two configurations are required for merge.");
        process.exit(2);
      }

      const mergedConfigPaths: string[] = [];

      config.options = config.options.reduce((accumulator: object, options) => {
        const configPath = config.path.get(options);
        const mergedOptions = merge(accumulator, options);

        mergedConfigPaths.push(configPath as string);

        return mergedOptions;
      }, {});
      config.path.set(config.options, mergedConfigPaths as unknown as string);
    }

    return config;
  }

  async buildConfig(
    config: WebpackCLIConfig,
    options: Partial<WebpackDevServerOptions>,
  ): Promise<WebpackCLIConfig> {
    const runFunctionOnEachConfig = (
      options: ConfigOptions | ConfigOptions[],
      fn: CallableFunction,
    ) => {
      if (Array.isArray(options)) {
        for (let item of options) {
          item = fn(item);
        }
      } else {
        options = fn(options);
      }

      return options;
    };

    if (options.analyze) {
      if (!this.checkPackageExists("webpack-bundle-analyzer")) {
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
    }

    if (typeof options.progress === "string" && options.progress !== "profile") {
      this.logger.error(
        `'${options.progress}' is an invalid value for the --progress option. Only 'profile' is allowed.`,
      );
      process.exit(2);
    }

    if (typeof options.hot === "string" && options.hot !== "only") {
      this.logger.error(
        `'${options.hot}' is an invalid value for the --hot option. Use 'only' instead.`,
      );
      process.exit(2);
    }

    const CLIPlugin = await this.tryRequireThenImport<
      Instantiable<CLIPluginClass, [CLIPluginOptions]>
    >("./plugins/CLIPlugin");

    const internalBuildConfig = (item: WebpackConfiguration) => {
      // Output warnings
      if (
        item.watch &&
        options.argv &&
        options.argv.env &&
        (options.argv.env["WEBPACK_WATCH"] || options.argv.env["WEBPACK_SERVE"])
      ) {
        this.logger.warn(
          `No need to use the '${
            options.argv.env["WEBPACK_WATCH"] ? "watch" : "serve"
          }' command together with '{ watch: true }' configuration, it does not make sense.`,
        );

        if (options.argv.env["WEBPACK_SERVE"]) {
          item.watch = false;
        }
      }

      // Apply options
      if (this.webpack.cli) {
        const args: Record<string, Argument> = this.getBuiltInOptions()
          .filter((flag) => flag.group === "core")
          .reduce((accumulator: Record<string, Argument>, flag) => {
            accumulator[flag.name] = flag as unknown as Argument;
            return accumulator;
          }, {});

        const values: ProcessedArguments = Object.keys(options).reduce(
          (accumulator: ProcessedArguments, name) => {
            if (name === "argv") {
              return accumulator;
            }

            const kebabName = this.toKebabCase(name);

            if (args[kebabName]) {
              accumulator[kebabName] = options[name as keyof typeof options as string];
            }

            return accumulator;
          },
          {},
        );

        const problems: Problem[] | null = this.webpack.cli.processArguments(args, item, values);

        if (problems) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const groupBy = (xs: Record<string, any>[], key: string) => {
            return xs.reduce((rv, x) => {
              (rv[x[key]] = rv[x[key]] || []).push(x);

              return rv;
            }, {});
          };
          const problemsByPath = groupBy(problems, "path");

          for (const path in problemsByPath) {
            const problems = problemsByPath[path];

            problems.forEach((problem: Problem) => {
              this.logger.error(
                `${this.capitalizeFirstLetter(problem.type.replace(/-/g, " "))}${
                  problem.value ? ` '${problem.value}'` : ""
                } for the '--${problem.argument}' option${
                  problem.index ? ` by index '${problem.index}'` : ""
                }`,
              );

              if (problem.expected) {
                this.logger.error(`Expected: '${problem.expected}'`);
              }
            });
          }

          process.exit(2);
        }

        const isFileSystemCacheOptions = (
          config: WebpackConfiguration,
        ): config is FileSystemCacheOptions => {
          return (
            Boolean(config.cache) && (config as FileSystemCacheOptions).cache.type === "filesystem"
          );
        };

        // Setup default cache options
        if (isFileSystemCacheOptions(item)) {
          const configPath = config.path.get(item);

          if (configPath) {
            if (!item.cache.buildDependencies) {
              item.cache.buildDependencies = {};
            }

            if (!item.cache.buildDependencies.defaultConfig) {
              item.cache.buildDependencies.defaultConfig = [];
            }

            if (Array.isArray(configPath)) {
              configPath.forEach((oneOfConfigPath) => {
                (
                  item.cache.buildDependencies as NonNullable<
                    FileSystemCacheOptions["cache"]["buildDependencies"]
                  >
                ).defaultConfig.push(oneOfConfigPath);
              });
            } else {
              item.cache.buildDependencies.defaultConfig.push(configPath);
            }
          }
        }
      }

      // Setup legacy logic for webpack@4
      // TODO respect `--entry-reset` in th next major release
      // TODO drop in the next major release
      if (options.entry) {
        item.entry = options.entry;
      }

      if (options.outputPath) {
        item.output = { ...item.output, ...{ path: path.resolve(options.outputPath) } };
      }

      if (options.target) {
        item.target = options.target;
      }

      if (typeof options.devtool !== "undefined") {
        item.devtool = options.devtool;
      }

      if (options.name) {
        item.name = options.name;
      }

      if (typeof options.stats !== "undefined") {
        item.stats = options.stats;
      }

      if (typeof options.watch !== "undefined") {
        item.watch = options.watch;
      }

      if (typeof options.watchOptionsStdin !== "undefined") {
        item.watchOptions = { ...item.watchOptions, ...{ stdin: options.watchOptionsStdin } };
      }

      if (options.mode) {
        item.mode = options.mode;
      }

      // Respect `process.env.NODE_ENV`
      if (
        !item.mode &&
        process.env &&
        process.env.NODE_ENV &&
        (process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "none")
      ) {
        item.mode = process.env.NODE_ENV;
      }

      // Setup stats
      // TODO remove after drop webpack@4
      const statsForWebpack4 =
        this.webpack.Stats &&
        (this.webpack.Stats as unknown as Partial<WebpackV4LegacyStats>).presetToOptions;

      if (statsForWebpack4) {
        if (typeof item.stats === "undefined") {
          item.stats = {};
        } else if (typeof item.stats === "boolean") {
          item.stats = (this.webpack.Stats as unknown as WebpackV4LegacyStats).presetToOptions(
            item.stats,
          );
        } else if (
          typeof item.stats === "string" &&
          (item.stats === "none" ||
            item.stats === "verbose" ||
            item.stats === "detailed" ||
            item.stats === "normal" ||
            item.stats === "minimal" ||
            item.stats === "errors-only" ||
            item.stats === "errors-warnings")
        ) {
          item.stats = (this.webpack.Stats as unknown as WebpackV4LegacyStats).presetToOptions(
            item.stats,
          );
        }
      } else {
        if (typeof item.stats === "undefined") {
          item.stats = { preset: "normal" };
        } else if (typeof item.stats === "boolean") {
          item.stats = item.stats ? { preset: "normal" } : { preset: "none" };
        } else if (typeof item.stats === "string") {
          item.stats = { preset: item.stats };
        }
      }

      let colors;

      // From arguments
      if (typeof this.isColorSupportChanged !== "undefined") {
        colors = Boolean(this.isColorSupportChanged);
      }
      // From stats
      else if (typeof (item.stats as StatsOptions).colors !== "undefined") {
        colors = (item.stats as StatsOptions).colors;
      }
      // Default
      else {
        colors = Boolean(this.colors.isColorSupported);
      }

      // TODO remove after drop webpack v4
      if (typeof item.stats === "object" && item.stats !== null) {
        item.stats.colors = colors;
      }

      // Apply CLI plugin
      if (!item.plugins) {
        item.plugins = [];
      }

      item.plugins.unshift(
        new CLIPlugin({
          configPath: config.path.get(item),
          helpfulOutput: !options.json,
          hot: options.hot,
          progress: options.progress,
          prefetch: options.prefetch,
          analyze: options.analyze,
        }),
      );

      return options;
    };

    runFunctionOnEachConfig(config.options, internalBuildConfig);

    return config;
  }

  isValidationError(error: Error): error is WebpackError {
    // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
    // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
    const ValidationError =
      this.webpack.ValidationError || this.webpack.WebpackOptionsValidationError;

    return error instanceof ValidationError || error.name === "ValidationError";
  }

  async createCompiler(
    options: Partial<WebpackDevServerOptions>,
    callback?: Callback<[Error | undefined, WebpackCLIStats | undefined]>,
  ): Promise<WebpackCompiler> {
    if (typeof options.nodeEnv === "string") {
      process.env.NODE_ENV = options.nodeEnv;
    }

    let config = await this.loadConfig(options);
    config = await this.buildConfig(config, options);

    let compiler: WebpackCompiler;
    try {
      compiler = this.webpack(
        config.options as WebpackConfiguration,
        callback
          ? (error, stats) => {
              if (error && this.isValidationError(error)) {
                this.logger.error(error.message);
                process.exit(2);
              }

              callback(error, stats);
            }
          : callback,
      );
      // @ts-expect-error error type assertion
    } catch (error: Error) {
      if (this.isValidationError(error)) {
        this.logger.error(error.message);
      } else {
        this.logger.error(error);
      }

      process.exit(2);
    }

    // TODO webpack@4 return Watching and MultiWatching instead Compiler and MultiCompiler, remove this after drop webpack@4
    if (compiler && (compiler as WebpackV4Compiler).compiler) {
      compiler = (compiler as WebpackV4Compiler).compiler;
    }

    return compiler;
  }

  needWatchStdin(compiler: Compiler | MultiCompiler): boolean {
    if (this.isMultipleCompiler(compiler)) {
      return Boolean(
        (compiler as MultiCompiler).compilers.some(
          (compiler: Compiler) =>
            compiler.options.watchOptions && compiler.options.watchOptions.stdin,
        ),
      );
    }

    return Boolean(compiler.options.watchOptions && compiler.options.watchOptions.stdin);
  }

  async runWebpack(options: WebpackRunOptions, isWatchCommand: boolean): Promise<void> {
    // eslint-disable-next-line prefer-const
    let compiler: Compiler | MultiCompiler;
    let createJsonStringifyStream: typeof stringifyStream;

    if (options.json) {
      const jsonExt = await this.tryRequireThenImport<JsonExt>("@discoveryjs/json-ext");

      createJsonStringifyStream = jsonExt.stringifyStream;
    }

    const callback = (error: Error | undefined, stats: WebpackCLIStats | undefined): void => {
      if (error) {
        this.logger.error(error);
        process.exit(2);
      }

      if (stats && stats.hasErrors()) {
        process.exitCode = 1;
      }

      if (!compiler || !stats) {
        return;
      }

      const statsOptions = this.isMultipleCompiler(compiler)
        ? {
            children: compiler.compilers.map((compiler) =>
              compiler.options ? compiler.options.stats : undefined,
            ),
          }
        : compiler.options
        ? compiler.options.stats
        : undefined;

      // TODO webpack@4 doesn't support `{ children: [{ colors: true }, { colors: true }] }` for stats
      const statsForWebpack4 =
        this.webpack.Stats &&
        (this.webpack.Stats as unknown as Partial<WebpackV4LegacyStats>).presetToOptions;

      if (this.isMultipleCompiler(compiler) && statsForWebpack4) {
        (statsOptions as StatsOptions).colors = (
          statsOptions as MultipleCompilerStatsOptions
        ).children.some((child) => child.colors);
      }

      if (options.json && createJsonStringifyStream) {
        const handleWriteError = (error: WebpackError) => {
          this.logger.error(error);
          process.exit(2);
        };

        if (options.json === true) {
          createJsonStringifyStream(stats.toJson(statsOptions as StatsOptions))
            .on("error", handleWriteError)
            .pipe(process.stdout)
            .on("error", handleWriteError)
            .on("close", () => process.stdout.write("\n"));
        } else {
          createJsonStringifyStream(stats.toJson(statsOptions as StatsOptions))
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
    }

    compiler = await this.createCompiler(options as WebpackDevServerOptions, callback);

    if (!compiler) {
      return;
    }

    const isWatch = (compiler: WebpackCompiler): boolean =>
      Boolean(
        this.isMultipleCompiler(compiler)
          ? compiler.compilers.some((compiler) => compiler.options.watch)
          : compiler.options.watch,
      );

    if (isWatch(compiler) && this.needWatchStdin(compiler)) {
      process.stdin.on("end", () => {
        process.exit(0);
      });
      process.stdin.resume();
    }
  }
}

module.exports = WebpackCLI;
