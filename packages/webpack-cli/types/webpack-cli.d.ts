/// <reference types="colorette" />
export = WebpackCLI;
declare class WebpackCLI {
  colors: import("colorette").Colorette & {
    isColorSupported: boolean;
  };
  /**
   * @private
   * @type {undefined | boolean}
   */
  private isColorSupportChanged;
  logger: Logger;
  /** @type {CLICommand} */
  program: CLICommand;
  /** @type {import("webpack") | undefined} */
  webpack: typeof import("webpack") | undefined;
  /**
   * @param {string} str
   * @returns {Capitalize<string>}
   */
  capitalizeFirstLetter(str: string): Capitalize<string>;
  /**
   * @param {string} str
   * @returns {string}
   */
  toKebabCase(str: string): string;
  /**
   * @param {boolean} [useColor]
   * @returns {import("colorette").Colorette & { isColorSupported: boolean }}
   */
  createColors(useColor?: boolean): import("colorette").Colorette & {
    isColorSupported: boolean;
  };
  /**
   * @returns {Logger}
   */
  getLogger(): Logger;
  /**
   * @param {string} packageName
   * @returns {boolean}
   */
  checkPackageExists(packageName: string): boolean;
  /**
   * @returns {string[]}
   */
  getAvailablePackageManagers(): string[];
  /**
   * @returns {"npm" | "yarn" | "pnpm" | undefined}
   */
  getDefaultPackageManager(): "npm" | "yarn" | "pnpm" | undefined;
  /**
   * @param {string} packageName
   * @param {{ preMessage?: () => void }} options
   * @returns {Promise<string>}
   */
  doInstall(
    packageName: string,
    options?: {
      preMessage?: () => void;
    },
  ): Promise<string>;
  /**
   * @template T
   * @param {string} module
   * @param {boolean} handleError
   * @returns {Promise<T>}
   */
  tryRequireThenImport<T>(module: string, handleError?: boolean): Promise<T>;
  /**
   * @template T
   * @param {string} pathToFile
   * @param {boolean} handleError
   * @returns {T}
   */
  loadJSONFile<T_1>(pathToFile: string, handleError?: boolean): T_1;
  /**
   * @param {CLICommandOptions} commandOptions
   * @param {TODO} options
   * @param {(...args: any[]) => void | Promise<void>} action
   * @returns {Promise<CLICommand>}
   */
  makeCommand(
    commandOptions: CLICommandOptions,
    options: TODO,
    action: (...args: any[]) => void | Promise<void>,
  ): Promise<CLICommand>;
  /**
   * @param {CLICommand} command
   * @param {CLIOptionOptions} option
   */
  makeOption(command: CLICommand, option: CLIOptionOptions): void;
  /**
   * @returns {CLIOptionOptions[]}
   */
  getBuiltInOptions(): CLIOptionOptions[];
  /**
   * @private
   * @type {CLIOptionOptions[]}
   */
  private builtInOptionsCache;
  /**
   * @param {boolean} handleError
   * @returns {Promise<typeof import("webpack")>}
   */
  loadWebpack(handleError?: boolean): Promise<typeof import("webpack")>;
  /**
   * @param {string[]} args
   * @param {ParseOptions} [parseOptions]
   * @returns {Promise<void>}
   */
  run(args: string[], parseOptions?: ParseOptions): Promise<void>;
  /**
   * @param {CLIOptions} options
   * @returns {Promise<LoadedConfiguration>}
   */
  loadConfig(options: CLIOptions): Promise<LoadedConfiguration>;
  /**
   * @param {LoadedConfiguration} config
   * @param {TODO} options
   * @returns {Promise<BuiltConfiguration>}
   */
  buildConfig(config: LoadedConfiguration, options: TODO): Promise<BuiltConfiguration>;
  /**
   * @param {unknown} error
   * @returns {boolean}
   */
  isValidationError(error: unknown): boolean;
  /**
   * @param {TODO} options
   * @param {TODO} callback
   * @returns {Promise<Compiler | MultiCompiler>}
   */
  createCompiler(options: TODO, callback: TODO): Promise<Compiler | MultiCompiler>;
  /**
   * @param {Compiler | MultiCompiler} compiler
   * @returns {boolean | undefined}
   */
  needWatchStdin(compiler: Compiler | MultiCompiler): boolean | undefined;
  /**
   * @param {TODO} options
   * @param {boolean} isWatchCommand
   * @returns {Promise<void>}
   */
  runWebpack(options: TODO, isWatchCommand: boolean): Promise<void>;
}
declare namespace WebpackCLI {
  export {
    Problem,
    Compiler,
    MultiCompiler,
    Stats,
    MultiStats,
    StatsOptions,
    Configuration,
    Argument,
    Command,
    CommandOptions,
    Help,
    ParseOptions,
    Argv,
    CLIOptions,
    CacheOptions,
    MultiConfiguration,
    PossibleConfiguration,
    LoadedConfiguration,
    BuiltConfiguration,
    Logger,
    CLICommandOptions,
    CLICommand,
    CLIOptionOptions,
    CLIOption,
    TODO,
  };
}
type Logger = {
  error: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
  info: (message?: any, ...optionalParams: any[]) => void;
  success: (message?: any, ...optionalParams: any[]) => void;
  log: (message?: any, ...optionalParams: any[]) => void;
  raw: (message?: any, ...optionalParams: any[]) => void;
};
type CLICommand = import("commander").Command & {
  options?: Option[];
  pkg?: string;
  forHelp?: boolean;
};
type CLICommandOptions = any & CommandOptions;
type TODO = any;
type CLIOptionOptions = Argument;
type ParseOptions = import("commander").ParseOptions;
type CLIOptions = {
  merge?: boolean;
  config: TODO;
  configName?: string[];
  argv: Argv;
};
type LoadedConfiguration = {
  path: WeakMap<PossibleConfiguration, string>;
  options: PossibleConfiguration;
};
type BuiltConfiguration = {
  path: WeakMap<PossibleConfiguration, string>;
  options: PossibleConfiguration;
};
type Compiler = import("webpack").Compiler;
type MultiCompiler = import("webpack").MultiCompiler;
type Problem = TODO;
type Stats = import("webpack").Stats;
type MultiStats = import("webpack").MultiStats;
type StatsOptions = import("webpack").StatsOptions;
type Configuration = import("webpack").Configuration;
type Argument = TODO;
type Command = import("commander").Command;
type CommandOptions = import("commander").CommandOptions;
type Help = import("commander").Help;
type Argv = {
  env: {
    WEBPACK_BUNDLE?: boolean;
    WEBPACK_BUILD?: boolean;
    WEBPACK_WATCH?: boolean;
    WEBPACK_SERVE?: boolean;
  };
};
type CacheOptions = TODO;
type MultiConfiguration = ReadonlyArray<Configuration> & {
  parallelism?: number;
};
type PossibleConfiguration = Configuration | MultiConfiguration;
type CLIOption = import("commander").Option & {
  helpLevel?: "minimum" | "verbose";
};
import { Option } from "commander";
import path = require("path");
