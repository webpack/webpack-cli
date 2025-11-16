import { Readable } from "node:stream";
import { type stringifyChunked } from "@discoveryjs/json-ext";
import {
  type Compiler,
  type Configuration,
  type MultiCompiler,
  type MultiStatsOptions,
  type Stats,
  type StatsOptions,
  type WebpackError,
  default as webpack,
} from "webpack";
import { type Configuration as DevServerConfig } from "webpack-dev-server";

/**
 * Logger interface for compiler operations
 */
interface Logger {
  error: (message: unknown) => void;
  raw: (message: string) => void;
}

/**
 * Color utility interface
 */
interface Colors {
  green: (text: string) => string;
  isColorSupported?: boolean;
}

/**
 * Webpack CLI configuration structure
 */
interface WebpackCLIConfig {
  options: Configuration | Configuration[];
  path: WeakMap<object, string[]>;
}

/**
 * Webpack callback type
 */
type WebpackCallback = (err: Error | undefined, stats: Stats | undefined) => void;

/**
 * Options for running webpack
 */
interface RunOptions extends Partial<DevServerConfig & Configuration> {
  json?: boolean | string;
  watch?: boolean;
  env?: Record<string, unknown>;
  failOnWarnings?: boolean;
  isWatchingLikeCommand?: boolean;
  argv?: unknown;
  nodeEnv?: string;
  configNodeEnv?: string;
}

/**
 * Exit signals to handle
 */
const EXIT_SIGNALS = ["SIGINT", "SIGTERM"];

/**
 * Manages webpack compiler creation and execution.
 *
 * This class handles:
 * - Creating webpack compiler instances
 * - Running webpack compilation
 * - Watch mode with stdin support
 * - JSON stats output
 * - Graceful shutdown
 *
 * @example
 * ```typescript
 * const compilerFactory = new CompilerFactory(logger, colors, webpack);
 *
 * // Create compiler
 * const compiler = await compilerFactory.createCompiler(config, options);
 *
 * // Run webpack
 * await compilerFactory.runWebpack(config, options, false);
 * ```
 */
export class CompilerFactory {
  private webpack: typeof webpack;

  constructor(
    webpackInstance: typeof webpack,
    private logger: Logger,
    private colors: Colors,
    private isMultipleCompiler: (compiler: Compiler | MultiCompiler) => compiler is MultiCompiler,
    private isValidationError: (error: unknown) => boolean,
    private loadConfig: (options: RunOptions) => Promise<WebpackCLIConfig>,
    private buildConfig: (
      config: WebpackCLIConfig,
      options: RunOptions,
    ) => Promise<WebpackCLIConfig>,
    private tryRequireThenImport: <T>(module: string) => Promise<T>,
  ) {
    this.webpack = webpackInstance;
  }

  /**
   * Creates a webpack compiler instance with the provided options
   *
   * This method:
   * 1. Sets NODE_ENV based on config options
   * 2. Loads and builds configuration
   * 3. Creates webpack compiler
   * 4. Handles validation errors
   *
   * @param options - Webpack and webpack-dev-server options
   * @param callback - Optional callback for compilation events
   * @returns Promise resolving to webpack Compiler or MultiCompiler instance
   * @throws {Error} If configuration is invalid or compiler creation fails
   *
   * @example
   * ```typescript
   * const compiler = await compilerFactory.createCompiler({
   *   mode: 'production',
   *   entry: './src/index.js'
   * });
   * ```
   */
  async createCompiler(
    options: RunOptions,
    callback?: WebpackCallback,
  ): Promise<Compiler | MultiCompiler> {
    if (typeof options.configNodeEnv === "string") {
      process.env.NODE_ENV = options.configNodeEnv;
    } else if (typeof options.nodeEnv === "string") {
      process.env.NODE_ENV = options.nodeEnv;
    }

    let config = await this.loadConfig(options);

    config = await this.buildConfig(config, options);

    let compiler: Compiler | MultiCompiler;

    try {
      compiler = this.webpack(
        config.options as Configuration,
        callback
          ? (error: Error | null, stats: Stats | undefined) => {
              if (error && this.isValidationError(error)) {
                this.logger.error(error.message);
                process.exit(2);
              }

              callback(error || undefined, stats);
            }
          : callback,
      )!;
    } catch (error) {
      if (this.isValidationError(error)) {
        this.logger.error((error as Error).message);
      } else {
        this.logger.error(error);
      }

      process.exit(2);
    }

    return compiler;
  }

  /**
   * Checks if stdin watch mode is needed for the compiler
   *
   * @param compiler - Webpack compiler instance
   * @returns true if stdin watch is needed, false otherwise
   */
  needWatchStdin(compiler: Compiler | MultiCompiler): boolean {
    if (this.isMultipleCompiler(compiler)) {
      return Boolean(
        compiler.compilers.some(
          (childCompiler: Compiler) => childCompiler.options.watchOptions?.stdin,
        ),
      );
    }

    return Boolean(compiler.options.watchOptions?.stdin);
  }

  /**
   * Executes webpack compilation with the provided options
   *
   * This method:
   * - Creates compiler with options
   * - Handles watch mode
   * - Outputs JSON stats if requested
   * - Sets up graceful shutdown handlers
   * - Manages stdin for watch mode termination
   *
   * @param config - Webpack configuration
   * @param options - Webpack run options including:
   *   - json: Output stats as JSON
   *   - watch: Enable watch mode
   *   - env: Environment variables
   *   - failOnWarnings: Exit with error code if warnings are present
   * @param isWatchCommand - Whether this is a watch command
   * @returns Promise that resolves when compilation completes (or never for watch mode)
   *
   * @example
   * ```typescript
   * await compilerFactory.runWebpack(config, {
   *   mode: 'production',
   *   entry: './src/index.js'
   * }, false);
   * ```
   */
  async runWebpack(
    config: WebpackCLIConfig,
    options: RunOptions,
    isWatchCommand: boolean,
  ): Promise<void> {
    let compiler: Compiler | MultiCompiler;
    let createStringifyChunked: typeof stringifyChunked;

    if (options.json) {
      const jsonExt = await this.tryRequireThenImport<{
        stringifyChunked: typeof stringifyChunked;
      }>("@discoveryjs/json-ext");

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
            children: compiler.compilers.map((childCompiler) =>
              childCompiler.options ? childCompiler.options.stats : undefined,
            ),
          } as MultiStatsOptions)
        : compiler.options
          ? (compiler.options.stats as StatsOptions)
          : undefined;

      if (options.json && createStringifyChunked) {
        const handleWriteError = (err: WebpackError) => {
          this.logger.error(err);
          process.exit(2);
        };

        if (options.json === true) {
          Readable.from(createStringifyChunked(stats.toJson(statsOptions as StatsOptions)))
            .on("error", handleWriteError)
            .pipe(process.stdout)
            .on("error", handleWriteError)
            .on("close", () => process.stdout.write("\n"));
        } else {
          const fs = require("node:fs");

          Readable.from(createStringifyChunked(stats.toJson(statsOptions as StatsOptions)))
            .on("error", handleWriteError)
            .pipe(fs.createWriteStream(options.json))
            .on("error", handleWriteError)
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

    compiler = await this.createCompiler(options, callback);

    if (!compiler) {
      return;
    }

    const isWatch = (compilerInstance: Compiler | MultiCompiler): boolean =>
      Boolean(
        this.isMultipleCompiler(compilerInstance)
          ? compilerInstance.compilers.some((comp) => comp.options.watch)
          : compilerInstance.options.watch,
      );

    if (isWatch(compiler)) {
      // Create closure to safely capture shutdown state
      const createShutdownHandler = () => {
        let needForceShutdown = false;

        return () => {
          if (needForceShutdown) {
            process.exit(0);
          }

          this.logger.error(
            "Gracefully shutting down. To force exit, press ^C again. Please wait...",
          );

          needForceShutdown = true;

          compiler.close(() => {
            process.exit(0);
          });
        };
      };

      const listener = createShutdownHandler();

      for (const signal of EXIT_SIGNALS) {
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
