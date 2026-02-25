import { type Command, type CommandOptions, type Option, type ParseOptions } from "commander";
import { type prepare } from "rechoir";
import {
  type AssetEmittedInfo,
  type Colors,
  type Compiler,
  type Configuration,
  type EntryOptions,
  type FileCacheOptions,
  type MultiCompiler,
  type MultiConfiguration,
  type MultiStats,
  type Stats,
  type WebpackError,
  type WebpackOptionsNormalized,
  default as webpack,
} from "webpack";

import {
  type ClientConfiguration,
  type Configuration as DevServerConfig,
} from "webpack-dev-server";

/**
 * Webpack CLI
 */

declare interface WebpackCallback {
  (err: null | Error, result?: Stats): void;
  (err: null | Error, result?: MultiStats): void;
}

// TODO remove me in the next major release, we don't need extra interface
// TODO also revisit all methods - remove unused or make private
interface IWebpackCLI {
  colors: WebpackCLIColors;
  logger: WebpackCLILogger;
  isColorSupportChanged: boolean | undefined;
  webpack: typeof webpack;
  program: WebpackCLICommand;
  isMultipleCompiler(compiler: WebpackCompiler): compiler is MultiCompiler;
  isPromise<T>(value: Promise<T>): value is Promise<T>;
  isFunction(value: unknown): value is CallableFunction;
  getLogger(): WebpackCLILogger;
  createColors(useColors?: boolean): WebpackCLIColors;
  toKebabCase: StringFormatter;
  capitalizeFirstLetter: StringFormatter;
  checkPackageExists(packageName: string): boolean;
  getDefaultPackageManager(): Promise<PackageManager | undefined>;
  doInstall(packageName: string, options?: PackageInstallOptions): Promise<string>;
  loadJSONFile<T = unknown>(path: Path, handleError: boolean): Promise<T>;
  tryRequireThenImport<T = unknown>(module: ModuleName, handleError: boolean): Promise<T>;
  getInfoOptions(): WebpackCLIBuiltInOption[];
  getInfoOutput(options: { output: string; additionalPackage: string[] }): Promise<string>;
  makeCommand(
    commandOptions: WebpackCLIOptions,
    options: WebpackCLICommandOptions,
    action: CommandAction,
  ): Promise<WebpackCLICommand | undefined>;
  makeOption(command: WebpackCLICommand, option: WebpackCLIBuiltInOption): void;
  run(
    args: Parameters<WebpackCLICommand["parseOptions"]>[0],
    parseOptions?: ParseOptions,
  ): Promise<void>;
  getBuiltInOptions(): WebpackCLIBuiltInOption[];
  loadWebpack(handleError?: boolean): Promise<typeof webpack>;
  loadConfig(options: Partial<WebpackDevServerOptions>): Promise<WebpackCLIConfig>;
  buildConfig(
    config: WebpackCLIConfig,
    options: WebpackDevServerOptions,
  ): Promise<WebpackCLIConfig>;
  isValidationError(error: Error): error is WebpackError;
  createCompiler(
    options: Partial<WebpackDevServerOptions>,
    callback?: WebpackCallback,
  ): Promise<WebpackCompiler>;
  needWatchStdin(compiler: Compiler | MultiCompiler): boolean;
  runWebpack(options: WebpackRunOptions, isWatchCommand: boolean): Promise<void>;
}

interface WebpackCLIColors extends Colors {
  isColorSupported: boolean;
}

interface WebpackCLILogger {
  error: LogHandler;
  warn: LogHandler;
  info: LogHandler;
  success: LogHandler;
  log: LogHandler;
  raw: LogHandler;
}

interface WebpackCLICommandOption extends CommanderOption {
  helpLevel?: "minimum" | "verbose";
}

interface WebpackCLIConfig {
  options: Configuration | MultiConfiguration;
  path: WeakMap<object, string[]>;
}

interface WebpackCLICommand extends Command {
  pkg: string | undefined;
  forHelp: boolean | undefined;
  _args: WebpackCLICommandOption[];
}

type WebpackCLIMainOption = Pick<
  WebpackCLIBuiltInOption,
  "valueName" | "description" | "defaultValue" | "multiple"
> & {
  flags: string;
  type: Set<BooleanConstructor | StringConstructor | NumberConstructor>;
};

interface WebpackCLIOptions extends CommandOptions {
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

type WebpackCLICommandOptions =
  | WebpackCLIBuiltInOption[]
  | (() => Promise<WebpackCLIBuiltInOption[]>);

interface WebpackCLIBuiltInFlag {
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
  helpLevel: "minimum" | "verbose";
}

interface WebpackCLIBuiltInOption extends WebpackCLIBuiltInFlag {
  hidden?: boolean;
  group?: "core";
}

/**
 * Webpack dev server
 */

type WebpackDevServerOptions = DevServerConfig &
  Configuration &
  ClientConfiguration &
  AssetEmittedInfo &
  WebpackOptionsNormalized &
  FileCacheOptions &
  Argv & {
    nodeEnv?: string;
    watchOptionsStdin?: boolean;
    progress?: boolean | "profile";
    analyze?: boolean;
    prefetch?: string;
    json?: boolean;
    entry: EntryOptions;
    merge?: boolean;
    config: string[];
    configName?: string[];
    disableInterpret?: boolean;
    extends?: string[];
    argv: Argv;
  };

/**
 * Webpack
 */
type LoadableWebpackConfiguration = PotentialPromise<Configuration | CallableWebpackConfiguration>;
type CallableWebpackConfiguration = (env: Env | undefined, argv: Argv) => Configuration;
type WebpackCompiler = Compiler | MultiCompiler;

interface EnumValueObject {
  [key: string]: EnumValue;
}
type EnumValueArray = EnumValue[];
type EnumValue = string | number | boolean | EnumValueObject | EnumValueArray | null;

interface ArgumentConfig {
  description?: string;
  negatedDescription?: string;
  path?: string;
  multiple?: boolean;
  type: "enum" | "string" | "path" | "number" | "boolean" | "RegExp" | "reset";
  values?: EnumValue[];
}

type FileSystemCacheOptions = Configuration & {
  cache: FileCacheOptions & { defaultConfig: string[] };
};

type ProcessedArguments = Record<string, (BasicPrimitive | RegExp)[]>;

type CommandAction = Parameters<WebpackCLICommand["action"]>[0];

interface WebpackRunOptions extends WebpackOptionsNormalized {
  progress?: boolean | "profile";
  json?: boolean;
  argv?: Argv;
  env: Env;
  failOnWarnings?: boolean;
  isWatchingLikeCommand?: boolean;
}

/**
 * Package management
 */

type PackageManager = "pnpm" | "yarn" | "npm";
interface PackageInstallOptions {
  preMessage?: () => void;
}

/**
 * Plugins and util types
 */

interface CLIPluginOptions {
  isMultiCompiler?: boolean;
  configPath?: string[];
  helpfulOutput: boolean;
  hot?: boolean | "only";
  progress?: boolean | "profile";
  prefetch?: string;
  analyze?: boolean;
}

type BasicPrimitive = string | boolean | number;
type Instantiable<
  InstanceType = unknown,
  ConstructorParameters extends unknown[] = unknown[],
> = new (...args: ConstructorParameters) => InstanceType;
type PotentialPromise<T> = T | Promise<T>;
type ModuleName = string;
type Path = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LogHandler = (value: any) => void;
type StringFormatter = (value: string) => string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Argv extends Record<string, any> {
  env?: Env;
}

interface Env {
  WEBPACK_BUNDLE?: boolean;
  WEBPACK_BUILD?: boolean;
  WEBPACK_WATCH?: boolean;
  WEBPACK_SERVE?: boolean;
  WEBPACK_PACKAGE?: string;
  WEBPACK_DEV_SERVER_PACKAGE?: string;
}

type DynamicImport<T> = (url: string) => Promise<{ default: T }>;

interface ImportLoaderError extends Error {
  code?: string;
}

/**
 * External libraries types
 */
type OptionConstructor = new (flags: string, description?: string) => Option;
type CommanderOption = InstanceType<OptionConstructor>;

interface Rechoir {
  prepare: typeof prepare;
}

interface RechoirError extends Error {
  failures: RechoirError[];
  error: Error;
}

interface PromptOptions {
  message: string;
  defaultResponse: string;
  stream: NodeJS.WritableStream;
}

type StringsKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

export {
  type ArgumentConfig,
  type Argv,
  type BasicPrimitive,
  type CLIPluginOptions,
  type CallableWebpackConfiguration,
  type CommandAction,
  type CommanderOption,
  type DynamicImport,
  type EnumValue,
  type FileSystemCacheOptions,
  type IWebpackCLI,
  type ImportLoaderError,
  type Instantiable,
  type LoadableWebpackConfiguration,
  type ModuleName,
  type PackageInstallOptions,
  type PackageManager,
  type Path,
  type PotentialPromise,
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
  type WebpackCLICommandOptions,
  type WebpackCLIConfig,
  type WebpackCLILogger,
  type WebpackCLIMainOption,
  type WebpackCLIOptions,
  type WebpackCallback,
  type WebpackCompiler,
  type WebpackDevServerOptions,
  type WebpackRunOptions,
};

export { type CommandOptions } from "commander";
export { type Argument, type Problem } from "webpack";
