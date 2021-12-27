/// <reference types="colorette" />
export = WebpackCLI;
declare class WebpackCLI {
  colors: import("colorette").Colorette & {
    isColorSupported: boolean;
  };
  isColorSupportChanged: any;
  logger: Logger;
  /** @type {WebpackCLICommand} */
  program: WebpackCLICommand;
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
   * @param {TODO} commandOptions
   * @param {TODO} options
   * @param {TODO} action
   * @returns {Promise<WebpackCLICommand>}
   */
  makeCommand(commandOptions: TODO, options: TODO, action: TODO): Promise<WebpackCLICommand>;
  makeOption(command: any, option: any): void;
  getBuiltInOptions(): any[];
  builtInOptionsCache: any[];
  /**
   * @param {boolean} handleError
   * @returns {Promise<typeof import("webpack")>}
   */
  loadWebpack(handleError?: boolean): Promise<typeof import("webpack")>;
  run(args: any, parseOptions: any): Promise<void>;
  webpack: typeof import("webpack");
  loadConfig(options: any): Promise<{
    options: {};
    path: WeakMap<object, any>;
  }>;
  /**
   * @param {Configuration | ReadonlyArray<Configuration> & MultiCompilerOptions} config
   * @param {TODO} options
   * @returns {Promise<Configuration | ReadonlyArray<Configuration> & MultiCompilerOptions>}
   */
  buildConfig(
    config: Configuration | (ReadonlyArray<Configuration> & MultiCompilerOptions),
    options: TODO,
  ): Promise<Configuration | (ReadonlyArray<Configuration> & MultiCompilerOptions)>;
  /**
   * @param {unknown} error
   * @returns {boolean}
   */
  isValidationError(error: unknown): boolean;
  /**
   * @param {Configuration | ReadonlyArray<Configuration> & MultiCompilerOptions} options
   * @param {TODO} callback
   * @returns {Promise<Compiler | MultiCompiler>}
   */
  createCompiler(
    options: Configuration | (ReadonlyArray<Configuration> & MultiCompilerOptions),
    callback: TODO,
  ): Promise<Compiler | MultiCompiler>;
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
    MultiCompilerOptions,
    Compiler,
    MultiCompiler,
    Stats,
    MultiStats,
    StatsOptions,
    Configuration,
    Command,
    Help,
    Argv,
    Logger,
    WebpackCLICommand,
    WebpackCLICommandOptions,
    WebpackCLIOption,
    CacheOptions,
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
type WebpackCLICommand = import("commander").Command & {
  options?: Option[];
  pkg?: string;
  forHelp?: boolean;
};
type TODO = any;
type Configuration = import("webpack").Configuration;
type MultiCompilerOptions = TODO;
type Compiler = import("webpack").Compiler;
type MultiCompiler = import("webpack").MultiCompiler;
type Problem = TODO;
type Stats = import("webpack").Stats;
type MultiStats = import("webpack").MultiStats;
type StatsOptions = import("webpack").StatsOptions;
type Command = import("commander").Command;
type Help = import("commander").Help;
type Argv = {
  env: {
    WEBPACK_BUNDLE?: boolean;
    WEBPACK_BUILD?: boolean;
    WEBPACK_WATCH?: boolean;
    WEBPACK_SERVE?: boolean;
  };
};
type WebpackCLICommandOptions = {
  name: string;
  alias?: string | string[];
  description?: string;
  usage?: string;
  pkg?: string;
  dependencies?: string[];
};
type WebpackCLIOption = import("commander").Option & {
  helpLevel?: "minimum" | "verbose";
};
type CacheOptions = TODO;
import { Option } from "commander";
