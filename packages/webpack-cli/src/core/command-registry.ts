import { default as webpack } from "webpack";
import {
  type CommandAction,
  type WebpackCLIBuiltInOption,
  type WebpackCLIColors,
  type WebpackCLICommand,
  type WebpackCLICommandOption,
  type WebpackCLILogger,
  type WebpackCLIOptions,
} from "../types.js";

/**
 * CLI option type definition
 */
type OptionType = typeof String | typeof Number | typeof Boolean | CallableFunction;

/**
 * Main option structure
 */
interface WebpackCLIMainOption {
  flags: string;
  valueName: string;
  description: string;
  type: Set<OptionType>;
  multiple?: boolean;
  defaultValue?: unknown;
}

/**
 * Negative option structure
 */
interface NegativeOption {
  flags: string;
  description: string;
}

/**
 * Manages webpack CLI command registration and option creation.
 *
 * This class handles:
 * - Command registration with Commander.js
 * - Command option parsing and validation
 * - Dependency checking and installation prompts
 * - Command loading (built-in and external)
 *
 * @example
 * ```typescript
 * const registry = new CommandRegistry(webpack, program, logger, colors, ...deps);
 *
 * // Register a command
 * await registry.makeCommand(
 *   { name: 'build', description: 'Run webpack' },
 *   options,
 *   async (entries, opts) => { ... }
 * );
 * ```
 */
export class CommandRegistry {
  private webpack: typeof webpack;

  constructor(
    webpackInstance: typeof webpack,
    private program: WebpackCLICommand,
    private logger: WebpackCLILogger,
    private colors: WebpackCLIColors,
    private checkPackageExists: (packageName: string) => boolean,
    private doInstall: (
      packageName: string,
      options?: { preMessage?: () => void },
    ) => Promise<string>,
    private tryRequireThenImport: <T>(module: string, handleError?: boolean) => Promise<T>,
    private capitalizeFirstLetter: (str: string | unknown) => string,
  ) {
    this.webpack = webpackInstance;
  }

  /**
   * Creates and registers a command with the CLI program
   *
   * @param commandOptions - Command configuration (name, alias, description, dependencies)
   * @param options - Command options (can be array or function returning array)
   * @param action - Command action handler
   * @returns Promise resolving to the created command, or undefined if already exists
   *
   * @example
   * ```typescript
   * await registry.makeCommand(
   *   { name: 'build [entries...]', alias: ['bundle', 'b'] },
   *   async () => getBuiltInOptions(),
   *   async (entries, options) => { ... }
   * );
   * ```
   */
  async makeCommand(
    commandOptions: WebpackCLIOptions,
    options: WebpackCLIBuiltInOption[] | (() => Promise<WebpackCLIBuiltInOption[]>),
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
      hidden: commandOptions.hidden,
      isDefault: commandOptions.isDefault,
    }) as WebpackCLICommand;

    if (commandOptions.description) {
      command.description(commandOptions.description, commandOptions.argsDescription!);
    }

    if (commandOptions.usage) {
      command.usage(commandOptions.usage);
    }

    if (Array.isArray(commandOptions.alias)) {
      command.aliases(commandOptions.alias);
    } else if (commandOptions.alias) {
      command.alias(commandOptions.alias);
    }

    command.pkg = commandOptions.pkg || "webpack-cli";

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

        const WEBPACK_PACKAGE_IS_CUSTOM = Boolean(process.env.WEBPACK_PACKAGE);
        const WEBPACK_PACKAGE = WEBPACK_PACKAGE_IS_CUSTOM
          ? (process.env.WEBPACK_PACKAGE as string)
          : "webpack";
        const WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM = Boolean(
          process.env.WEBPACK_DEV_SERVER_PACKAGE,
        );
        const WEBPACK_DEV_SERVER_PACKAGE = WEBPACK_DEV_SERVER_PACKAGE_IS_CUSTOM
          ? (process.env.WEBPACK_DEV_SERVER_PACKAGE as string)
          : "webpack-dev-server";

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

    let resolvedOptions = options;

    if (typeof resolvedOptions === "function") {
      if (forHelp && !allDependenciesInstalled && commandOptions.dependencies) {
        command.description(
          `${
            commandOptions.description
          } To see all available options you need to install ${commandOptions.dependencies
            .map((dependency) => `'${dependency}'`)
            .join(", ")}.`,
        );
        resolvedOptions = [];
      } else {
        resolvedOptions = await resolvedOptions();
      }
    }

    for (const option of resolvedOptions) {
      this.makeOption(command, option);
    }

    command.action(action);

    return command;
  }

  /**
   * Creates and adds an option to a command
   *
   * This method handles:
   * - Type inference (String, Number, Boolean, custom parsers)
   * - Negative options (--no-flag)
   * - Multiple values
   * - Default values
   * - Help levels (minimum, verbose)
   *
   * @param command - The command to add the option to
   * @param option - Option configuration
   *
   * @example
   * ```typescript
   * registry.makeOption(command, {
   *   name: 'mode',
   *   configs: [{ type: 'string' }],
   *   description: 'Set webpack mode'
   * });
   * ```
   */
  makeOption(command: WebpackCLICommand, option: WebpackCLIBuiltInOption): void {
    let mainOption: WebpackCLIMainOption;
    let negativeOption: NegativeOption | undefined;
    const flagsWithAlias = ["devtool", "output-path", "target", "watch", "extends"];

    if (flagsWithAlias.includes(option.name)) {
      [option.alias] = option.name;
    }

    if (option.configs) {
      let needNegativeOption = false;
      let negatedDescription: string | undefined;
      const mainOptionType: WebpackCLIMainOption["type"] = new Set();

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

    // Add value placeholder to flags
    if (mainOption.type.size > 1 && mainOption.type.has(Boolean)) {
      mainOption.flags = `${mainOption.flags} [${mainOption.valueName || "value"}${
        mainOption.multiple ? "..." : ""
      }]`;
    } else if (mainOption.type.size > 0 && !mainOption.type.has(Boolean)) {
      mainOption.flags = `${mainOption.flags} <${mainOption.valueName || "value"}${
        mainOption.multiple ? "..." : ""
      }>`;
    }

    // Create the appropriate Commander option based on type
    const { Option } = require("commander");

    if (mainOption.type.size === 1) {
      if (mainOption.type.has(Number)) {
        let skipDefault = true;

        const optionForCommand: WebpackCLICommandOption = new Option(
          mainOption.flags,
          mainOption.description,
        )
          .argParser((value: string, prev: number[] = []) => {
            if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
              prev = [];
              skipDefault = false;
            }

            return mainOption.multiple ? [...prev, Number(value)] : Number(value);
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
          .argParser((value: string, prev: string[] = []) => {
            if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
              prev = [];
              skipDefault = false;
            }

            return mainOption.multiple ? [...prev, value] : value;
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
          .argParser([...mainOption.type][0])
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
        .argParser((value: string, prev: unknown[] = []) => {
          if (mainOption.defaultValue && mainOption.multiple && skipDefault) {
            prev = [];
            skipDefault = false;
          }

          if (mainOption.type.has(Number)) {
            const numberValue = Number(value);

            if (!Number.isNaN(numberValue)) {
              return mainOption.multiple ? [...prev, numberValue] : numberValue;
            }
          }

          if (mainOption.type.has(String)) {
            return mainOption.multiple ? [...prev, value] : value;
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

  /**
   * Loads a command by name, installing dependencies if needed
   *
   * Handles:
   * - Built-in commands (build, watch, help, version)
   * - External built-in commands (serve, info, configtest)
   * - Custom commands via packages
   *
   * @param commandName - Name of the command to load
   * @param allowToInstall - Whether to prompt for package installation
   * @param builtInCommands - Configuration for built-in commands
   * @returns Promise that resolves when command is loaded
   *
   * @example
   * ```typescript
   * await registry.loadCommandByName('build', true, {
   *   buildCommandOptions,
   *   watchCommandOptions,
   *   // ...
   * });
   * ```
   */
  async loadCommandByName(
    commandName: string,
    allowToInstall: boolean,
    builtInCommands: {
      buildCommandOptions: WebpackCLIOptions;
      watchCommandOptions: WebpackCLIOptions;
      helpCommandOptions: WebpackCLIOptions;
      versionCommandOptions: WebpackCLIOptions;
      externalBuiltInCommandsInfo: {
        name: string;
        alias: string | string[];
        pkg: string;
      }[];
    },
    callbacks: {
      onBuildCommand: () => Promise<WebpackCLICommand | undefined>;
      onWatchCommand: () => Promise<WebpackCLICommand | undefined>;
      onHelpCommand: () => Promise<WebpackCLICommand | undefined>;
      onVersionCommand: () => Promise<WebpackCLICommand | undefined>;
    },
  ): Promise<void> {
    const {
      buildCommandOptions,
      watchCommandOptions,
      helpCommandOptions,
      versionCommandOptions,
      externalBuiltInCommandsInfo,
    } = builtInCommands;

    const getCommandName = (name: string) => name.split(" ")[0];
    const isCommand = (input: string, commandOptions: WebpackCLIOptions) => {
      const longName = getCommandName(commandOptions.name);

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
    };

    const isBuildCommandUsed = isCommand(commandName, buildCommandOptions);
    const isWatchCommandUsed = isCommand(commandName, watchCommandOptions);

    if (isBuildCommandUsed || isWatchCommandUsed) {
      await (isBuildCommandUsed ? callbacks.onBuildCommand() : callbacks.onWatchCommand());
    } else if (isCommand(commandName, helpCommandOptions)) {
      await callbacks.onHelpCommand();
    } else if (isCommand(commandName, versionCommandOptions)) {
      await callbacks.onVersionCommand();
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
        type Instantiable<T> = new () => T;

        loadedCommand = await this.tryRequireThenImport<
          Instantiable<{ apply: (cli: unknown) => Promise<void> }>
        >(pkg, false);
      } catch {
        // Ignore, command is not installed
        return;
      }

      try {
        // eslint-disable-next-line new-cap
        const command = new loadedCommand();

        // Pass context that has the program and makeCommand
        await command.apply({ program: this.program, makeCommand: this.makeCommand.bind(this) });
      } catch (error) {
        this.logger.error(`Unable to load '${pkg}' command`);
        this.logger.error(error);
        process.exit(2);
      }
    }
  }
}
