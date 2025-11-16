import { type Help } from "commander";
import {
  type WebpackCLIBuiltInOption,
  type WebpackCLIColors,
  type WebpackCLICommand,
  type WebpackCLICommandOption,
  type WebpackCLILogger,
  type WebpackCLIOptions,
} from "../types.js";

/**
 * Enum value type
 */
type EnumValue = string | number | boolean;

/**
 * Information structure for envinfo
 */
interface Information {
  Binaries?: string[];
  Browsers?: string[];
  Monorepos?: string[];
  System?: string[];
  npmGlobalPackages?: string[];
  npmPackages?: string | string[];
}

/**
 * Manages help output formatting and generation for webpack CLI.
 *
 * This class handles:
 * - Help text formatting and display
 * - Command documentation
 * - Option documentation
 * - Version information display
 * - Environment information (via envinfo)
 *
 * @example
 * ```typescript
 * const formatter = new HelpFormatter(logger, colors, ...deps);
 *
 * // Display help for a command
 * await formatter.outputHelp(['build'], false, false, program);
 *
 * // Get info output
 * const info = await formatter.getInfoOutput({ output: 'json', additionalPackage: [] });
 * ```
 */
export class HelpFormatter {
  constructor(
    private logger: WebpackCLILogger,
    private colors: WebpackCLIColors,
    private tryRequireThenImport: <T>(module: string, handleError?: boolean) => Promise<T>,
    private capitalizeFirstLetter: (str: string | unknown) => string,
    private getBuiltInOptions: () => WebpackCLIBuiltInOption[],
  ) {}

  /**
   * Gets the options available for the info command
   *
   * @returns Array of built-in options for info command
   */
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

  /**
   * Gets environment and package information using envinfo
   *
   * @param options - Output format and additional packages
   * @returns Promise resolving to formatted environment information
   *
   * @example
   * ```typescript
   * const info = await formatter.getInfoOutput({
   *   output: 'json',
   *   additionalPackage: ['babel-loader']
   * });
   * console.log(info);
   * ```
   */
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

    const envinfo = await this.tryRequireThenImport<typeof import("envinfo")>("envinfo", false);

    let info = await envinfo.run(defaultInformation, envinfoConfig);

    info = info.replace("npmPackages", "Packages");
    info = info.replace("npmGlobalPackages", "Global Packages");

    return info;
  }

  /**
   * Outputs formatted help text for commands and options
   *
   * This method handles:
   * - Global help (all commands)
   * - Command-specific help
   * - Option-specific help
   * - Verbose mode
   *
   * @param options - Options/commands to show help for
   * @param isVerbose - Whether to show verbose help
   * @param isHelpCommandSyntax - Whether using 'webpack help' syntax
   * @param program - The main CLI program
   * @param loadCommandByName - Callback to load commands
   * @param findCommandByName - Callback to find loaded commands
   * @param getCommandName - Callback to get command name from full name
   * @param isOption - Callback to check if a value is an option
   * @param isGlobalOption - Callback to check if an option is global
   * @param knownCommands - List of known command configurations
   * @param externalBuiltInCommandsInfo - External built-in command info
   * @param buildCommandOptions - Build command configuration
   *
   * @example
   * ```typescript
   * await formatter.outputHelp(
   *   ['build'],
   *   false,
   *   false,
   *   program,
   *   loadCommandByName,
   *   findCommandByName,
   *   // ... other callbacks
   * );
   * ```
   */
  async outputHelp(
    options: string[],
    isVerbose: boolean,
    isHelpCommandSyntax: boolean,
    program: WebpackCLICommand,
    loadCommandByName: (name: string) => Promise<void>,
    findCommandByName: (name: string) => WebpackCLICommand | undefined,
    getCommandName: (name: string) => string,
    isOption: (value: string) => boolean,
    isGlobalOption: (value: string) => boolean,
    knownCommands: WebpackCLIOptions[],
    externalBuiltInCommandsInfo: {
      name: string;
      alias: string | string[];
      pkg: string;
    }[],
    buildCommandOptions: WebpackCLIOptions,
  ): Promise<void> {
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

          return `${parentCmdNames}${command.name()}|${command.aliases().join("|")} ${command.usage()}`;
        },
        // Support multiple aliases
        subcommandTerm: (command: WebpackCLICommand) => {
          const humanReadableArgumentName = (argument: WebpackCLICommandOption) => {
            const nameOutput = argument.name() + (argument.variadic ? "..." : "");

            return argument.required ? `<${nameOutput}>` : `[${nameOutput}]`;
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

            // Hide `--watch` option when developer use `webpack watch --help`
            if (
              (options[0] === "w" || options[0] === "watch") &&
              (option.name() === "watch" || option.name() === "no-watch")
            ) {
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
          const globalOptionList = program.options.map((option: WebpackCLICommandOption) =>
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
          knownCommands.map((knownCommand) => loadCommandByName(getCommandName(knownCommand.name))),
        );

        const buildCommand = findCommandByName(getCommandName(buildCommandOptions.name));

        if (buildCommand) {
          this.logger.raw(buildCommand.helpInformation());
        }
      } else {
        const [name] = options;

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

      const flag = this.getBuiltInOptions().find(
        (builtInFlag) => option.long === `--${builtInFlag.name}`,
      );

      if (flag?.configs) {
        const possibleValues: EnumValue[] = [];
        for (const config of flag.configs) {
          if (config.values) {
            possibleValues.push(...(config.values as EnumValue[]));
          }
        }

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
}
