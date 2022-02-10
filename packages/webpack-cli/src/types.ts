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

type Option = InstanceType<OptionConstructor>;
export type OptionType = Option & {
  helpLevel?: "minimum" | "verbose";
};
export type BasicPrimitive = string | boolean | number;
export type Instantiable<ConstructorParameters extends any[] = any[], InstanceType = any> = {
  new (...args: ConstructorParameters): InstanceType;
};
export type PotentialPromise<T> = T | Promise<T>;
export type Module = string;
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
export interface Problem {
  type: ProblemType;
  path: string;
  argument: string;
  value?: unknown;
  index?: number;
  expected?: string;
}
type ProblemType =
  | "unknown-argument"
  | "unexpected-non-array-in-path"
  | "unexpected-non-object-in-path"
  | "multiple-values-unexpected"
  | "invalid-value";

export type FileSystemCacheOptions = WebpackConfiguration & {
  cache: FileCacheOptions & { defaultConfig: unknown[] };
};

export type ProcessArgumentsValues = Record<
  string,
  BasicPrimitive | RegExp | (BasicPrimitive | RegExp)[]
>;

export type LegacyCompiler = Compiler & {
  compiler: Compiler;
};

export type WebpackCommand = Command & { options: Option[]; _args: Option[] };

export type DevServerOptions = DevServerConfig &
  WebpackConfiguration &
  ClientConfiguration &
  AssetEmittedInfo &
  CLIOptions & {
    nodeEnv?: "string";
    watchOptionsStdin?: boolean;
    progress?: boolean | "profile";
    analyze?: boolean;
    prefetch?: string;
    json?: unknown;
    entry: EntryOptions;
  } & WebpackOptionsNormalized &
  FileCacheOptions &
  Argv;
export type Env = {
  WEBPACK_BUNDLE?: boolean;
  WEBPACK_BUILD?: boolean;
  WEBPACK_WATCH?: boolean;
  WEBPACK_SERVE?: boolean;
};
export type Argv = {
  env?: Env;
} & Record<string, any>;
export type CLIOptions = {
  merge?: boolean;
  config: any;
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
export type CommandCliOption = Command;
export type InstallOptions = {
  preMessage?: (...args: any[]) => void;
};
export type CommandAction = Parameters<Command["action"]>[0];
export type CommandCliOptions = BuiltInOptions[] | (() => Promise<BuiltInOptions[]>);
export interface IWebpackCLI {
  colors: Colors;
  logger: Logger;
  isColorSupportChanged: boolean | undefined;
  webpack: typeof webpack;
  builtInOptionsCache: BuiltInOptions[] | undefined;
  program: Command & { forHelp: boolean };
  getLogger: () => Logger;
  createColors: (useColors?: boolean) => Colors;
  toKebabCase: StringFormatter;
  capitalizeFirstLetter: StringFormatter;
  checkPackageExists: (packageName: string) => boolean;
  getAvailablePackageManagers: () => PackageManager[];
  getDefaultPackageManager: () => PackageManager | undefined;
  doInstall: (packageName: string, options: InstallOptions) => Promise<string>;
  loadJSONFile: <T = any>(path: Path, handleError: boolean) => Promise<T>;
  tryRequireThenImport: <T = any>(module: Module, handleError: boolean) => Promise<T>;
  runWebpack: (options: Options, isWatchCommand: boolean) => Promise<void>;
  makeCommand: (
    commandOptions: CommandOptionType,
    options: CommandCliOptions,
    action: CommandAction,
  ) => Promise<ExtendedCommand | undefined>;
  isValidationError: (error: Error) => boolean;
  run(
    args: Parameters<WebpackCommand["parseOptions"]>[0],
    parseOptions?: ParseOptions,
  ): Promise<void>;
}
export type Options = WebpackOptionsNormalized & {
  json?: boolean;
  argv?: Argv;
  env: Env;
};

export interface Logger {
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
export type CommandOptionType = {
  name: string;
  alias: string | string[];
  description: string;
  usage?: string;
  dependencies?: string[];
  pkg?: string;
  argsDescription?: { [argName: string]: string };
} & CommandOptions;

export type ExtendedCommand = Command & {
  pkg?: string;
};
export type CommandInfo = {
  name: string;
  alias: string[] | string;
  description?: string;
  pkg: string;
};

export type Config = {
  options: WebpackConfiguration | WebpackConfiguration[];
  path: WeakMap<object, string>;
};
export type WebpackFailure = {
  error: WebpackError;
};
export type MainOptionType = Set<BooleanConstructor | StringConstructor | NumberConstructor>;
export type MainOption = {
  flags: string;
  type: MainOptionType;
  description: string;
  defaultValue: string | undefined;
  multiple: boolean | undefined;
};
