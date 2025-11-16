import { type Configuration, type MultiCompilerOptions, default as webpack } from "webpack";
import { type Configuration as DevServerConfig } from "webpack-dev-server";
import { type Instantiable, type WebpackCLIBuiltInOption } from "../types.js";

/**
 * Logger interface for configuration operations
 */
interface Logger {
  error: (message: unknown) => void;
  warn: (message: string) => void;
  success: (message: string) => void;
}

/**
 * Color utility interface
 */
interface Colors {
  yellow: (text: string) => string;
  green: (text: string) => string;
}

/**
 * Webpack CLI configuration structure
 */
interface WebpackCLIConfig {
  options: Configuration | (Configuration[] & MultiCompilerOptions);
  path: WeakMap<object, string[]>;
}

/**
 * Partial options for webpack dev server
 */
type PartialWebpackDevServerOptions = Partial<DevServerConfig & Configuration & { argv?: unknown }>;

/**
 * CLI plugin options
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

/**
 * Manages webpack configuration loading, building, and processing.
 *
 * This class handles:
 * - Loading configs from specified paths or auto-discovery
 * - Support for multiple config formats (JS, TS, CJS, ESM, CoffeeScript)
 * - Config name filtering
 * - Config extending and merging
 * - Config building with CLI options
 * - Plugin injection (CLIPlugin)
 *
 * @example
 * ```typescript
 * const configManager = new ConfigManager(logger, colors, webpack);
 *
 * // Load config
 * const config = await configManager.loadConfig({
 *   config: ['./webpack.prod.config.js']
 * });
 *
 * // Build config with options
 * const builtConfig = await configManager.buildConfig(config, {
 *   mode: 'production',
 *   progress: true
 * });
 * ```
 */
export class ConfigManager {
  private webpack: typeof webpack;

  constructor(
    webpackInstance: typeof webpack,
    private logger: Logger,
    private colors: Colors,
    private tryRequireThenImport: <T>(
      module: string,
      handleError?: boolean,
      moduleType?: string,
    ) => Promise<T>,
    private isPromise: <T>(value: unknown) => value is Promise<T>,
    private isFunction: (value: unknown) => value is CallableFunction,
    private isValidationError: (error: unknown) => boolean,
    private capitalizeFirstLetter: (str: string) => string,
    private toKebabCase: (str: string) => string,
    private checkPackageExists: (packageName: string) => boolean,
    private getBuiltInOptions: () => WebpackCLIBuiltInOption[],
    private doInstall: (
      packageName: string,
      options?: { preMessage?: () => void },
    ) => Promise<string>,
  ) {
    this.webpack = webpackInstance;
  }

  /**
   * Loads webpack configuration from files or discovers default config
   *
   * This method handles:
   * - Loading configs from specified paths
   * - Auto-discovery of default config files (webpack.config.js, etc.)
   * - Support for multiple config formats (JS, TS, CJS, ESM, CoffeeScript)
   * - Config name filtering when config exports multiple configurations
   * - Config extending and merging
   *
   * @param options - Configuration options including:
   *   - config: Array of config file paths
   *   - configName: Names of specific configs to use
   *   - extends: Configs to extend from
   *   - merge: Whether to merge multiple configs
   *   - disableInterpret: Disable rechoir for loading TypeScript/CoffeeScript
   * @returns Promise resolving to loaded configuration and path mapping
   *
   * @example
   * ```typescript
   * // Load specific config
   * const config = await configManager.loadConfig({
   *   config: ['./webpack.prod.config.js']
   * });
   *
   * // Load with extends
   * const config = await configManager.loadConfig({
   *   extends: ['./webpack.base.config.js']
   * });
   * ```
   */
  async loadConfig(options: PartialWebpackDevServerOptions): Promise<WebpackCLIConfig> {
    const fs = require("node:fs");
    const path = require("node:path");

    const disableInterpret =
      typeof (options as { disableInterpret?: boolean }).disableInterpret !== "undefined" &&
      (options as { disableInterpret?: boolean }).disableInterpret;

    const interpret = require("interpret");

    type LoadableConfig = Configuration | (() => Configuration | Promise<Configuration>);

    const loadConfigByPath = async (
      configPath: string,
      argv: unknown = {},
    ): Promise<{ options: Configuration | Configuration[]; path: string }> => {
      const ext = path.extname(configPath).toLowerCase();
      let interpreted = Object.keys(interpret.jsVariants).find((variant) => variant === ext);

      // Fallback `.cts` to `.ts`
      if (!interpreted && ext.endsWith(".cts")) {
        interpreted = interpret.jsVariants[".ts"];
      }

      if (interpreted && !disableInterpret) {
        const rechoir = require("rechoir");

        try {
          rechoir.prepare(interpret.extensions, configPath);
        } catch (error: unknown) {
          const rechoirError = error as { failures?: { error: Error }[] };

          if (rechoirError?.failures) {
            this.logger.error(`Unable load '${configPath}'`);
            this.logger.error((error as Error).message);

            for (const failure of rechoirError.failures) {
              this.logger.error(failure.error.message);
            }

            this.logger.error("Please install one of them");
            process.exit(2);
          }

          this.logger.error(error);
          process.exit(2);
        }
      }

      let options: LoadableConfig | LoadableConfig[];

      let moduleType: "unknown" | "commonjs" | "esm" = "unknown";

      switch (ext) {
        case ".cjs":
        case ".cts":
          moduleType = "commonjs";
          break;
        case ".mjs":
        case ".mts":
          moduleType = "esm";
          break;
      }

      try {
        options = await this.tryRequireThenImport<LoadableConfig | LoadableConfig[]>(
          configPath,
          false,
          moduleType,
        );
      } catch (error) {
        this.logger.error(`Failed to load '${configPath}' config`);

        if (this.isValidationError(error)) {
          this.logger.error((error as Error).message);
        } else {
          this.logger.error(error);
        }

        process.exit(2);
      }

      if (!options) {
        this.logger.error(`Failed to load '${configPath}' config. Unable to find default export.`);
        process.exit(2);
      }

      // Handle arrays of configs
      if (Array.isArray(options)) {
        const optionsArray: LoadableConfig[] = options;

        await Promise.all(
          optionsArray.map(async (_, i) => {
            if (this.isPromise(optionsArray[i] as Promise<Configuration>)) {
              optionsArray[i] = await optionsArray[i];
            }

            // Promise may return Function
            if (this.isFunction(optionsArray[i])) {
              optionsArray[i] = await (optionsArray[i] as CallableFunction)(
                (argv as { env?: unknown }).env,
                argv,
              );
            }
          }),
        );

        options = optionsArray;
      } else {
        if (this.isPromise(options as Promise<LoadableConfig>)) {
          options = await options;
        }

        // Promise may return Function
        if (this.isFunction(options)) {
          options = await (options as CallableFunction)((argv as { env?: unknown }).env, argv);
        }
      }

      const isObject = (value: unknown): value is object =>
        typeof value === "object" && value !== null;

      if (!isObject(options) && !Array.isArray(options)) {
        this.logger.error(`Invalid configuration in '${configPath}'`);
        process.exit(2);
      }

      return {
        options: options as Configuration | Configuration[],
        path: configPath,
      };
    };

    const config: WebpackCLIConfig = {
      options: {},
      path: new WeakMap(),
    };

    // Load specified configs or discover default
    if (
      (options as { config?: string[] }).config &&
      (options as { config?: string[] }).config!.length > 0
    ) {
      const loadedConfigs = await Promise.all(
        (options as { config?: string[] }).config!.map((configPath: string) =>
          loadConfigByPath(path.resolve(configPath), options.argv),
        ),
      );

      if (loadedConfigs.length === 1) {
        config.options = loadedConfigs[0].options;
        config.path.set(loadedConfigs[0].options, [loadedConfigs[0].path]);
      } else {
        config.options = [];

        for (const loadedConfig of loadedConfigs) {
          if (Array.isArray(loadedConfig.options)) {
            for (const item of loadedConfig.options) {
              (config.options as Configuration[]).push(item);
              config.path.set(options, [loadedConfig.path]);
            }
          } else {
            (config.options as Configuration[]).push(loadedConfig.options);
            config.path.set(loadedConfig.options, [loadedConfig.path]);
          }
        }
      }
    } else {
      // Auto-discover default config files
      const extensions = new Set([
        ".js",
        ".mjs",
        ".cjs",
        ".ts",
        ".cts",
        ".mts",
        ...Object.keys(interpret.extensions),
      ]);

      const defaultConfigFiles = new Set(
        ["webpack.config", ".webpack/webpack.config", ".webpack/webpackfile"].flatMap((filename) =>
          [...extensions].map((ext) => path.resolve(filename + ext)),
        ),
      );

      let foundDefaultConfigFile;

      for (const defaultConfigFile of defaultConfigFiles) {
        if (!fs.existsSync(defaultConfigFile)) {
          continue;
        }

        foundDefaultConfigFile = defaultConfigFile;
        break;
      }

      if (foundDefaultConfigFile) {
        const loadedConfig = await loadConfigByPath(foundDefaultConfigFile, options.argv);

        config.options = loadedConfig.options;

        if (Array.isArray(config.options)) {
          for (const item of config.options) {
            config.path.set(item, [loadedConfig.path]);
          }
        } else {
          config.path.set(loadedConfig.options, [loadedConfig.path]);
        }
      }
    }

    // Filter by config name if specified
    if ((options as { configName?: string[] }).configName) {
      const notFoundConfigNames: string[] = [];

      config.options = (options as { configName?: string[] }).configName!.map((configName) => {
        let found;

        if (Array.isArray(config.options)) {
          found = config.options.find((opt) => (opt as { name?: string }).name === configName);
        } else {
          found =
            (config.options as { name?: string }).name === configName ? config.options : undefined;
        }

        if (!found) {
          notFoundConfigNames.push(configName);
        }

        return found;
      }) as Configuration[];

      if (notFoundConfigNames.length > 0) {
        this.logger.error(
          notFoundConfigNames
            .map((configName) => `Configuration with the name "${configName}" was not found.`)
            .join(" "),
        );
        process.exit(2);
      }
    }

    // Handle extends
    const resolveExtends = async (
      cfg: Configuration,
      configPaths: WeakMap<object, string[]>,
      extendsPaths: string[],
    ): Promise<Configuration> => {
      delete (cfg as { extends?: unknown }).extends;

      const loadedConfigs = await Promise.all(
        extendsPaths.map((extendsPath) =>
          loadConfigByPath(path.resolve(extendsPath), options.argv),
        ),
      );

      const webpackMergeModule = await this.tryRequireThenImport<{
        default?: CallableFunction;
        merge?: CallableFunction;
      }>("webpack-merge");
      const merge = (webpackMergeModule.default ||
        webpackMergeModule.merge ||
        webpackMergeModule) as CallableFunction;
      const loadedOptions = loadedConfigs.flatMap((loadedConfig) => loadedConfig.options);

      if (loadedOptions.length > 0) {
        const prevPaths = configPaths.get(cfg);
        const loadedPaths = loadedConfigs.flatMap((loadedConfig) => loadedConfig.path);

        if (prevPaths) {
          const intersection = loadedPaths.filter((element) => prevPaths.includes(element));

          if (intersection.length > 0) {
            this.logger.error("Recursive configuration detected, exiting.");
            process.exit(2);
          }
        }

        cfg = merge(
          ...(loadedOptions as [Configuration, ...Configuration[]]),
          cfg,
        ) as Configuration;

        if (prevPaths) {
          configPaths.set(cfg, [...prevPaths, ...loadedPaths]);
        }
      }

      if ((cfg as { extends?: unknown }).extends) {
        const extendsPaths =
          typeof (cfg as { extends?: unknown }).extends === "string"
            ? [(cfg as { extends: string }).extends]
            : (cfg as { extends: string[] }).extends;

        cfg = await resolveExtends(cfg, configPaths, extendsPaths);
      }

      return cfg;
    };

    // Process extends from CLI or config
    const extendsOption = (options as { extends?: string[] }).extends;

    if (extendsOption && extendsOption.length > 0) {
      if (Array.isArray(config.options)) {
        config.options = await Promise.all(
          config.options.map((opt) => resolveExtends(opt, config.path, extendsOption)),
        );
      } else {
        config.options = await resolveExtends(config.options, config.path, extendsOption);
      }
    } else if (
      Array.isArray(config.options) &&
      config.options.some((opt) => (opt as { extends?: unknown }).extends)
    ) {
      config.options = await Promise.all(
        config.options.map((opt) => {
          if ((opt as { extends?: unknown }).extends) {
            const ext = (opt as { extends?: unknown }).extends;

            return resolveExtends(
              opt,
              config.path,
              typeof ext === "string" ? [ext] : (ext as string[]),
            );
          }

          return opt;
        }),
      );
    } else if (
      !Array.isArray(config.options) &&
      (config.options as { extends?: unknown }).extends
    ) {
      const ext = (config.options as { extends?: unknown }).extends;

      config.options = await resolveExtends(
        config.options,
        config.path,
        typeof ext === "string" ? [ext] : (ext as string[]),
      );
    }

    // Handle merge
    if ((options as { merge?: boolean }).merge) {
      const webpackMergeModule = await this.tryRequireThenImport<{
        default?: CallableFunction;
        merge?: CallableFunction;
      }>("webpack-merge");
      const merge = (webpackMergeModule.default ||
        webpackMergeModule.merge ||
        webpackMergeModule) as CallableFunction;

      if (!Array.isArray(config.options) || config.options.length <= 1) {
        this.logger.error("At least two configurations are required for merge.");
        process.exit(2);
      }

      const mergedConfigPaths: string[] = [];

      config.options = config.options.reduce((accumulator: object, opt) => {
        const configPath = config.path.get(opt);
        const mergedOptions = merge(accumulator, opt) as Configuration;

        if (configPath) {
          mergedConfigPaths.push(...configPath);
        }

        return mergedOptions;
      }, {});

      config.path.set(config.options, mergedConfigPaths);
    }

    return config;
  }

  /**
   * Builds webpack configuration by applying CLI options and plugins
   *
   * This method:
   * - Installs webpack-bundle-analyzer if --analyze is used
   * - Validates progress option
   * - Applies CLI options to config
   * - Injects CLIPlugin for enhanced output
   * - Sets up stats and colors
   * - Configures file system cache build dependencies
   *
   * @param config - Loaded webpack configuration
   * @param options - CLI options to apply
   * @returns Promise resolving to built configuration
   *
   * @example
   * ```typescript
   * const builtConfig = await configManager.buildConfig(config, {
   *   mode: 'production',
   *   progress: true,
   *   analyze: true
   * });
   * ```
   */
  async buildConfig(
    config: WebpackCLIConfig,
    options: PartialWebpackDevServerOptions & {
      analyze?: boolean;
      progress?: boolean | "profile";
      json?: boolean;
      isWatchingLikeCommand?: boolean;
      argv?: { env?: { WEBPACK_WATCH?: boolean; WEBPACK_SERVE?: boolean }; watch?: boolean };
    },
  ): Promise<WebpackCLIConfig> {
    // Install webpack-bundle-analyzer if needed
    if (options.analyze && !this.checkPackageExists("webpack-bundle-analyzer")) {
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

    // Validate progress option
    if (typeof options.progress === "string" && options.progress !== "profile") {
      this.logger.error(
        `'${options.progress}' is an invalid value for the --progress option. Only 'profile' is allowed.`,
      );
      process.exit(2);
    }

    // Load CLIPlugin
    const CLIPlugin =
      await this.tryRequireThenImport<Instantiable<unknown, [CLIPluginOptions]>>(
        "./plugins/cli-plugin",
      );

    const internalBuildConfig = (item: Configuration) => {
      const originalWatchValue = (item as { watch?: boolean }).watch;

      // Apply CLI options to config
      const args: Record<string, unknown> = this.getBuiltInOptions().reduce(
        (accumulator, flag) => {
          if (flag.group === "core") {
            accumulator[flag.name] = flag;
          }

          return accumulator;
        },
        {} as Record<string, unknown>,
      );

      const values: Record<string, unknown> = Object.keys(options).reduce(
        (accumulator, name) => {
          if (name === "argv") {
            return accumulator;
          }

          const kebabName = this.toKebabCase(name);

          if (args[kebabName]) {
            accumulator[kebabName] = options[name as keyof typeof options];
          }

          return accumulator;
        },
        {} as Record<string, unknown>,
      );

      if (Object.keys(values).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const problems = this.webpack.cli.processArguments(args as any, item, values as any);

        if (problems) {
          const groupBy = <T extends { path: string }>(xs: T[], key: keyof T) =>
            xs.reduce(
              (rv: Record<string, T[]>, problem: T) => {
                const pathValue = problem[key] as string;

                (rv[pathValue] ||= []).push(problem);

                return rv;
              },
              {} as Record<string, T[]>,
            );

          const problemsByPath = groupBy(
            problems as {
              path: string;
              type: string;
              value?: string;
              argument: string;
              index?: string;
              expected?: string;
            }[],
            "path",
          );

          for (const path in problemsByPath) {
            const pathProblems = problemsByPath[path];

            for (const problem of pathProblems) {
              this.logger.error(
                `${this.capitalizeFirstLetter(problem.type.replaceAll("-", " "))}${
                  problem.value ? ` '${problem.value}'` : ""
                } for the '--${problem.argument}' option${
                  problem.index ? ` by index '${problem.index}'` : ""
                }`,
              );

              if (problem.expected) {
                this.logger.error(`Expected: '${problem.expected}'`);
              }
            }
          }

          process.exit(2);
        }
      }

      // Output warnings
      if (!Object.isExtensible(item)) {
        return;
      }

      if (
        options.isWatchingLikeCommand &&
        options.argv?.env &&
        (typeof originalWatchValue !== "undefined" || typeof options.argv?.watch !== "undefined")
      ) {
        this.logger.warn(
          `No need to use the '${
            options.argv.env.WEBPACK_WATCH ? "watch" : "serve"
          }' command together with '{ watch: true | false }' or '--watch'/'--no-watch' configuration, it does not make sense.`,
        );

        if (options.argv.env.WEBPACK_SERVE) {
          (item as { watch?: boolean }).watch = false;
        }
      }

      // Setup default cache options
      const { cache } = item as {
        cache?: { type?: string; buildDependencies?: { defaultConfig?: string[] } };
      };

      if (cache && cache.type === "filesystem" && Object.isExtensible(cache)) {
        const configPath = config.path.get(item);

        if (configPath) {
          if (!cache.buildDependencies) {
            cache.buildDependencies = {};
          }

          if (!cache.buildDependencies.defaultConfig) {
            cache.buildDependencies.defaultConfig = [];
          }

          if (Array.isArray(configPath)) {
            for (const oneOfConfigPath of configPath) {
              cache.buildDependencies.defaultConfig.push(oneOfConfigPath);
            }
          } else {
            cache.buildDependencies.defaultConfig.push(configPath as unknown as string);
          }
        }
      }

      // Respect process.env.NODE_ENV
      if (
        !(item as { mode?: string }).mode &&
        process.env?.NODE_ENV &&
        (process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "production" ||
          process.env.NODE_ENV === "none")
      ) {
        (item as { mode?: string }).mode = process.env.NODE_ENV as
          | "development"
          | "production"
          | "none";
      }

      // Setup stats
      let { stats } = item as { stats?: unknown };

      if (typeof stats === "undefined") {
        stats = { preset: "normal" };
      } else if (typeof stats === "boolean") {
        stats = stats ? { preset: "normal" } : { preset: "none" };
      } else if (typeof stats === "string") {
        stats = { preset: stats };
      }

      (item as { stats?: unknown }).stats = stats;

      // Determine colors
      let colors: boolean;
      const isColorSupportChanged = (this.colors as unknown as { isColorSupported?: boolean })
        .isColorSupported;

      if (typeof isColorSupportChanged !== "undefined") {
        colors = Boolean(isColorSupportChanged);
      } else if (typeof (stats as { colors?: boolean }).colors !== "undefined") {
        colors = (stats as { colors?: boolean }).colors!;
      } else {
        colors = Boolean(
          (this.colors as unknown as { isColorSupported?: boolean }).isColorSupported,
        );
      }

      if (Object.isExtensible(stats)) {
        (stats as { colors?: boolean }).colors = colors;
      }

      // Apply CLIPlugin
      let { plugins } = item as { plugins?: unknown[] };

      if (!plugins) {
        plugins = [];
        (item as { plugins?: unknown[] }).plugins = plugins;
      }

      if (Object.isExtensible(plugins)) {
        plugins.unshift(
          new CLIPlugin({
            configPath: config.path.get(item),
            helpfulOutput: !options.json,
            progress: options.progress,
            analyze: options.analyze,
            isMultiCompiler: Array.isArray(config.options),
          }),
        );
      }
    };

    // Apply to all configs
    if (Array.isArray(config.options)) {
      for (const item of config.options) {
        internalBuildConfig(item);
      }
    } else {
      internalBuildConfig(config.options);
    }

    return config;
  }
}
