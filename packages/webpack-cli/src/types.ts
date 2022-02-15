import webpack, {
  EntryOptions,
  Stats,
  Configuration,
  WebpackError,
  StatsOptions,
  WebpackOptionsNormalized,
  Compiler,
  MultiCompiler,
  Problem,
  Argument,
  AssetEmittedInfo,
  FileCacheOptions,
} from "webpack";

// eslint-disable-next-line node/no-extraneous-import
import { ClientConfiguration, Configuration as DevServerConfig } from "webpack-dev-server";

import { Colorette } from "colorette";
import { Command, CommandOptions, OptionConstructor, ParseOptions } from "commander";
import { prepare } from "rechoir";
import { stringifyStream } from "@discoveryjs/json-ext";

/**
 * Webpack CLI
 */

interface IWebpackCLI {
  colors: WebpackCLIColors;
  logger: WebpackCLILogger;
  isColorSupportChanged: boolean | undefined;
  webpack: typeof webpack;
  builtInOptionsCache: WebpackCLIBuiltInOption[] | undefined;
  program: WebpackCLICommand;
  isMultipleCompiler(compiler: WebpackCompiler): compiler is MultiCompiler;
  isPromise<T>(value: Promise<T>): value is Promise<T>;
  isFunction(value: unknown): value is CallableFunction;
  getLogger(): WebpackCLILogger;
  createColors(useColors?: boolean): WebpackCLIColors;
  toKebabCase: StringFormatter;
  capitalizeFirstLetter: StringFormatter;
  checkPackageExists(packageName: string): boolean;
  getAvailablePackageManagers(): PackageManager[];
  getDefaultPackageManager(): PackageManager | undefined;
  doInstall(packageName: string, options?: PackageInstallOptions): Promise<string>;
  loadJSONFile<T = unknown>(path: Path, handleError: boolean): Promise<T>;
  tryRequireThenImport<T = unknown>(module: ModuleName, handleError: boolean): Promise<T>;
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
    callback?: Callback<[Error | undefined, WebpackCLIStats | undefined]>,
  ): Promise<WebpackCompiler>;
  needWatchStdin(compiler: Compiler | MultiCompiler): boolean;
  runWebpack(options: WebpackRunOptions, isWatchCommand: boolean): Promise<void>;
}

interface WebpackCLIColors extends Colorette {
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
  options: WebpackConfiguration | WebpackConfiguration[];
  path: WeakMap<object, string>;
}

interface WebpackCLICommand extends Command {
  pkg: string | undefined;
  forHelp: boolean | undefined;
  options: WebpackCLICommandOption[];
  _args: WebpackCLICommandOption[];
}

interface WebpackCLIStats extends Stats {
  presetToOptions?: (item: string | boolean) => StatsOptions;
}

type WebpackCLIMainOption = Pick<
  WebpackCLIBuiltInOption,
  "description" | "defaultValue" | "multiple"
> & {
  flags: string;
  type: Set<BooleanConstructor | StringConstructor | NumberConstructor>;
};

interface WebpackCLIOptions extends CommandOptions {
  name: string;
  alias: string | string[];
  description?: string;
  usage?: string;
  dependencies?: string[];
  pkg?: string;
  argsDescription?: { [argName: string]: string };
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
  configs?: Partial<FlagConfig>[];
  negative?: boolean;
  multiple?: boolean;
  description: string;
  describe?: string;
  negatedDescription?: string;
  defaultValue?: string;
}

interface WebpackCLIBuiltInOption extends WebpackCLIBuiltInFlag {
  hidden?: boolean;
  group?: "core";
  helpLevel?: "minimum" | "verbose";
}

type WebpackCLIExternalCommandInfo = Pick<WebpackCLIOptions, "name" | "alias" | "description"> & {
  pkg: string;
};

/**
 * Webpack dev server
 */

type WebpackDevServerOptions = DevServerConfig &
  WebpackConfiguration &
  ClientConfiguration &
  AssetEmittedInfo &
  WebpackOptionsNormalized &
  FileCacheOptions &
  Argv & {
    nodeEnv?: "string";
    watchOptionsStdin?: boolean;
    progress?: boolean | "profile" | undefined;
    analyze?: boolean;
    prefetch?: string;
    json?: boolean;
    entry: EntryOptions;
    merge?: boolean;
    config: string[];
    configName?: string[];
    argv: Argv;
  };

type Callback<T extends unknown[]> = (...args: T) => void;

/**
 * Webpack
 */

type WebpackConfiguration = Configuration;
type ConfigOptions = PotentialPromise<WebpackConfiguration | CallableOption>;
type CallableOption = (env: Env | undefined, argv: Argv) => WebpackConfiguration;
type WebpackCompiler = Compiler | MultiCompiler;

type FlagType = boolean | "enum" | "string" | "path" | "number" | "boolean" | "RegExp" | "reset";

type FlagConfig = {
  negatedDescription: string;
  type: FlagType;
  values: FlagType[];
};

type FileSystemCacheOptions = WebpackConfiguration & {
  cache: FileCacheOptions & { defaultConfig: string[] };
};

type ProcessedArguments = Record<string, BasicPrimitive | RegExp | (BasicPrimitive | RegExp)[]>;

type MultipleCompilerStatsOptions = StatsOptions & { children: StatsOptions[] };
type CommandAction = Parameters<WebpackCLICommand["action"]>[0];

interface WebpackRunOptions extends WebpackOptionsNormalized {
  json?: boolean;
  argv?: Argv;
  env: Env;
}

/**
 * Package management
 */

type PackageManager = "pnpm" | "yarn" | "npm";
interface PackageInstallOptions {
  preMessage?: () => void;
}
interface BasicPackageJsonContent {
  name: string;
  version: string;
  description: string;
  license: string;
}

/**
 * Webpack V4
 */

type WebpackV4LegacyStats = Required<WebpackCLIStats>;
interface WebpackV4Compiler extends Compiler {
  compiler: Compiler;
}

/**
 * Plugins and util types
 */

interface CLIPluginOptions {
  configPath?: string;
  helpfulOutput: boolean;
  hot?: boolean | "only";
  progress?: boolean | "profile";
  prefetch?: string;
  analyze?: boolean;
}

type BasicPrimitive = string | boolean | number;
type Instantiable<InstanceType = unknown, ConstructorParameters extends unknown[] = unknown[]> = {
  new (...args: ConstructorParameters): InstanceType;
};
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

type CommanderOption = InstanceType<OptionConstructor>;

interface Rechoir {
  prepare: typeof prepare;
}

interface JsonExt {
  stringifyStream: typeof stringifyStream;
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

export {
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
  Argument,
  BasicPrimitive,
  BasicPackageJsonContent,
  CallableOption,
  Callback,
  CLIPluginOptions,
  CommandAction,
  CommanderOption,
  CommandOptions,
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
  Problem,
  PotentialPromise,
  Rechoir,
  RechoirError,
};
