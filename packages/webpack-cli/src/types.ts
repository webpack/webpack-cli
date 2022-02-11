import { Colorette } from "colorette";
// eslint-disable-next-line node/no-extraneous-import
import { ClientConfiguration, Configuration as DevServerConfig } from "webpack-dev-server";

import { Command, CommandOptions, OptionConstructor, ParseOptions } from "commander";
import { prepare } from "rechoir";
import webpack, { EntryOptions } from "webpack";
import {
  Stats,
  Configuration,
  WebpackError,
  StatsOptions,
  WebpackOptionsNormalized,
  Compiler,
  MultiCompiler,
  FileCacheOptions,
  AssetEmittedInfo,
} from "webpack";

export type Env = {
  WEBPACK_BUNDLE?: boolean;
  WEBPACK_BUILD?: boolean;
  WEBPACK_WATCH?: boolean;
  WEBPACK_SERVE?: boolean;
};

export type Argv = {
  env?: Env;
} & Record<string, any>;

type CommanderOption = InstanceType<OptionConstructor>;

export type WebpackCLICommandOption = CommanderOption & {
  helpLevel?: "minimum" | "verbose";
};
export type BasicPrimitive = string | boolean | number;
export type DynamicImport<T> = (url: string) => Promise<{ default: T }>;
export type Instantiable<
  InstanceType = unknown,
  ConstructorParameters extends any[] = unknown[],
> = {
  new (...args: ConstructorParameters): InstanceType;
};
export type PotentialPromise<T> = T | Promise<T>;
export type ModuleName = string;
export type Path = string;
export type PackageManager = "pnpm" | "yarn" | "npm";
export type Colors = Colorette & {
  isColorSupported: boolean;
};
type LogHandler = (value: any) => void;
type StringFormatter = (value: string) => string;

export type BuiltConfig = {
  options: WebpackConfiguration | WebpackConfiguration[];
  path: WeakMap<object, string>;
};
export type CLIPluginOptions = {
  configPath?: string;
  helpfulOutput: boolean;
  hot?: boolean | "only";
  progress?: boolean | "profile";
  prefetch?: string;
  analyze?: boolean;
};

export type FileSystemCacheOptions = WebpackConfiguration & {
  cache: FileCacheOptions & { defaultConfig: unknown[] };
};

export type ProcessedArguments = Record<
  string,
  BasicPrimitive | RegExp | (BasicPrimitive | RegExp)[]
>;

export type WebpackV4Compiler = Compiler & {
  compiler: Compiler;
};

export type WebpackCLICommand = Command & {
  pkg: string | undefined;
  forHelp: boolean | undefined;
  options: WebpackCLICommandOption[];
  _args: WebpackCLICommandOption[];
};

export type DevServerOptions = DevServerConfig &
  WebpackConfiguration &
  ClientConfiguration &
  AssetEmittedInfo &
  CLIOptions &
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
  };

export type CLIOptions = {
  merge?: boolean;
  config: string[];
  configName?: string[];
  argv: Argv;
};

export type Callback<T extends unknown[]> = (...args: T) => void;
export type WebpackConfiguration = Configuration;
export type ConfigOptions = PotentialPromise<WebpackConfiguration | CallableOption>;
export type CallableOption = (env: Env | undefined, argv: Argv) => WebpackConfiguration;
export type Rechoir = {
  prepare: typeof prepare;
};

export type RechoirError = Error & {
  failures: RechoirError[];
  error: Error;
};
export type WebpackCompiler = Compiler | MultiCompiler;

export type FlagConfig = {
  negatedDescription: string;
  type: OptionConfigType;
  values: OptionConfigType[];
};

export type CliStats = Stats & {
  presetToOptions?: (item: string | boolean) => StatsOptions;
};

export type WebpackV4LegacyStats = Required<CliStats>;
type OptionConfigType =
  | boolean
  | "enum"
  | "string"
  | "path"
  | "number"
  | "boolean"
  | "RegExp"
  | "reset";

export type PackageInstallOptions = {
  preMessage?: () => void;
};
export type CommandAction = Parameters<WebpackCLICommand["action"]>[0];
export type CommandCliOptions = BuiltInOptions[] | (() => Promise<BuiltInOptions[]>);

export interface IWebpackCLI {
  colors: Colors;
  logger: WebpackCLILogger;
  isColorSupportChanged: boolean | undefined;
  webpack: typeof webpack;
  builtInOptionsCache: BuiltInOptions[] | undefined;
  program: WebpackCLICommand;
  getLogger(): WebpackCLILogger;
  createColors(useColors?: boolean): Colors;
  toKebabCase: StringFormatter;
  capitalizeFirstLetter: StringFormatter;
  checkPackageExists(packageName: string): boolean;
  getAvailablePackageManagers(): PackageManager[];
  getDefaultPackageManager(): PackageManager | undefined;
  doInstall(packageName: string, options?: PackageInstallOptions): Promise<string>;
  loadJSONFile<T = any>(path: Path, handleError: boolean): Promise<T>;
  tryRequireThenImport<T = any>(module: ModuleName, handleError: boolean): Promise<T>;
  makeCommand(
    commandOptions: WebpackCLIOptions,
    options: CommandCliOptions,
    action: CommandAction,
  ): Promise<WebpackCLICommand | undefined>;
  makeOption(command: WebpackCLICommand | WebpackCLICommand, option: BuiltInOptions): void;
  run(
    args: Parameters<WebpackCLICommand["parseOptions"]>[0],
    parseOptions?: ParseOptions,
  ): Promise<void>;
  getBuiltInOptions(): BuiltInOptions[];
  loadWebpack(handleError: boolean): Promise<typeof webpack>;
  loadConfig(options: DevServerOptions): Promise<BuiltConfig>;
  buildConfig(config: BuiltConfig, options: DevServerOptions): Promise<BuiltConfig>;
  isValidationError(error: Error): error is WebpackError;
  createCompiler(
    options: DevServerOptions,
    callback: Callback<[Error | undefined, CliStats | undefined]>,
  ): Promise<WebpackCompiler>;
  needWatchStdin(compiler: Compiler | MultiCompiler): undefined | boolean;
  runWebpack(options: WebpackRunOptions, isWatchCommand: boolean): Promise<void>;
}
export type WebpackRunOptions = WebpackOptionsNormalized & {
  json?: boolean;
  argv?: Argv;
  env: Env;
};

export interface WebpackCLILogger {
  error: LogHandler;
  warn: LogHandler;
  info: LogHandler;
  success: LogHandler;
  log: LogHandler;
  raw: LogHandler;
}

export type BuiltInFlag = {
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
};

export type BuiltInOptions = BuiltInFlag & {
  hidden?: boolean;
  group?: "core";
  helpLevel: "minimum" | "verbose";
};

export type WebpackCLIOptions = {
  name: string;
  alias: string | string[];
  description?: string;
  usage?: string;
  dependencies?: string[];
  pkg?: string;
  argsDescription?: { [argName: string]: string };
} & CommandOptions;

export type BuiltInExternalCommandInfo = Pick<
  WebpackCLIOptions,
  "name" | "alias" | "description"
> & {
  pkg: string;
};

export type ImportLoaderError = Error & {
  code?: string;
};

export type MainOption = Pick<BuiltInOptions, "description" | "defaultValue" | "multiple"> & {
  flags: string;
  type: Set<BooleanConstructor | StringConstructor | NumberConstructor>;
};
