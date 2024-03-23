async loadConfig(options: Partial<WebpackDevServerOptions>) {
    const disableInterpret =
      typeof options.disableInterpret !== "undefined" && options.disableInterpret;

    const interpret = require("interpret");
    const loadConfigByPath = async (configPath: string, argv: Argv = {}) => {
      const ext = path.extname(configPath).toLowerCase();
      let interpreted = Object.keys(interpret.jsVariants).find((variant) => variant === ext);
      // Fallback `.cts` to `.ts`
      // TODO implement good `.mts` support after https://github.com/gulpjs/rechoir/issues/43
      // For ESM and `.mts` you need to use: 'NODE_OPTIONS="--loader ts-node/esm" webpack-cli --config ./webpack.config.mts'
      if (!interpreted && /\.cts$/.test(ext)) {
        interpreted = interpret.jsVariants[".ts"];
      }

      if (interpreted && !disableInterpret) {
        const rechoir: Rechoir = require("rechoir");

        try {
          rechoir.prepare(interpret.extensions, configPath);
        } catch (error) {
          if ((error as RechoirError)?.failures) {
            this.logger.error(`Unable load '${configPath}'`);
            this.logger.error((error as RechoirError).message);
            for (const failure of (error as RechoirError).failures) {
              this.logger.error(failure.error.message);
            }
            this.logger.error("Please install one of them");
            process.exit(2);
          }

          this.logger.error(error);
          process.exit(2);
        }
      }

      let options: ConfigOptions | ConfigOptions[];

      type LoadConfigOption = PotentialPromise<WebpackConfiguration>;

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
        options = await this.tryRequireThenImport<LoadConfigOption | LoadConfigOption[]>(
          configPath,
          false,
          moduleType,
        );
        // @ts-expect-error error type assertion
      } catch (error: Error) {
        this.logger.error(`Failed to load '${configPath}' config`);

        if (this.isValidationError(error)) {
          this.logger.error(error.message);
        } else {
          this.logger.error(error);
        }

        process.exit(2);
      }

      if (!options) {
        this.logger.error(`Failed to load '${configPath}' config. Unable to find default export.`);
        process.exit(2);
      }

      if (Array.isArray(options)) {
        // reassign the value to assert type
        const optionsArray: ConfigOptions[] = options;
        await Promise.all(
          optionsArray.map(async (_, i) => {
            if (
              this.isPromise<WebpackConfiguration | CallableOption>(
                optionsArray[i] as Promise<WebpackConfiguration | CallableOption>,
              )
            ) {
              optionsArray[i] = await optionsArray[i];
            }
            // `Promise` may return `Function`
            if (this.isFunction(optionsArray[i])) {
              // when config is a function, pass the env from args to the config function
              optionsArray[i] = await (optionsArray[i] as CallableOption)(argv.env, argv);
            }
          }),
        );
        options = optionsArray;
      } else {
        if (this.isPromise<ConfigOptions>(options as Promise<ConfigOptions>)) {
          options = await options;
        }

        // `Promise` may return `Function`
        if (this.isFunction(options)) {
          // when config is a function, pass the env from args to the config function
          options = await options(argv.env, argv);
        }
      }

      const isObject = (value: unknown): value is object =>
        typeof value === "object" && value !== null;

      if (!isObject(options) && !Array.isArray(options)) {
        this.logger.error(`Invalid configuration in '${configPath}'`);

        process.exit(2);
      }

      return { options, path: configPath };
    };

    const config: WebpackCLIConfig = {
      options: {} as WebpackConfiguration,
      path: new WeakMap(),
    };

    if (options.config && options.config.length > 0) {
      const loadedConfigs = await Promise.all(
        options.config.map((configPath: string) =>
          loadConfigByPath(path.resolve(configPath), options.argv),
        ),
      );

      config.options = [];

      loadedConfigs.forEach((loadedConfig) => {
        const isArray = Array.isArray(loadedConfig.options);

        // TODO we should run webpack multiple times when the `--config` options have multiple values with `--merge`, need to solve for the next major release
        if ((config.options as ConfigOptions[]).length === 0) {
          config.options = loadedConfig.options as WebpackConfiguration;
        } else {
          if (!Array.isArray(config.options)) {
            config.options = [config.options];
          }

          if (isArray) {
            for (const item of loadedConfig.options as ConfigOptions[]) {
              (config.options as ConfigOptions[]).push(item);
            }
          } else {
            config.options.push(loadedConfig.options as WebpackConfiguration);
          }
        }

        if (isArray) {
          for (const options of loadedConfig.options as ConfigOptions[]) {
            config.path.set(options, [loadedConfig.path]);
          }
        } else {
          config.path.set(loadedConfig.options, [loadedConfig.path]);
        }
      });

      config.options = config.options.length === 1 ? config.options[0] : config.options;
    } else {
      // TODO ".mts" is not supported by `interpret`, need to add it
      // Prioritize popular extensions first to avoid unnecessary fs calls
      const extensions = [
        ".js",
        ".mjs",
        ".cjs",
        ".ts",
        ".cts",
        ".mts",
        ...Object.keys(interpret.extensions),
      ];
      // Order defines the priority, in decreasing order
      const defaultConfigFiles = new Set(
        ["webpack.config", ".webpack/webpack.config", ".webpack/webpackfile"].flatMap((filename) =>
          extensions.map((ext) => path.resolve(filename + ext)),
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

        config.options = loadedConfig.options as WebpackConfiguration[];

        if (Array.isArray(config.options)) {
          for (const item of config.options) {
            config.path.set(item, [loadedConfig.path]);
          }
        } else {
          config.path.set(loadedConfig.options, [loadedConfig.path]);
        }
      }
    }

    if (options.configName) {
      const notFoundConfigNames: string[] = [];

      config.options = options.configName.map((configName: string) => {
        let found;

        if (Array.isArray(config.options)) {
          found = config.options.find((options) => options.name === configName);
        } else {
          found = config.options.name === configName ? config.options : undefined;
        }

        if (!found) {
          notFoundConfigNames.push(configName);
        }

        return found;
      }) as WebpackConfiguration[];

      if (notFoundConfigNames.length > 0) {
        this.logger.error(
          notFoundConfigNames
            .map((configName) => `Configuration with the name "${configName}" was not found.`)
            .join(" "),
        );
        process.exit(2);
      }
    }

    const resolveExtends = async (
      config: WebpackConfiguration,
      configPaths: WebpackCLIConfig["path"],
      extendsPaths: string[],
    ): Promise<WebpackConfiguration> => {
      delete config.extends;

      const loadedConfigs = await Promise.all(
        extendsPaths.map((extendsPath) =>
          loadConfigByPath(path.resolve(extendsPath), options.argv),
        ),
      );

      const merge = await this.tryRequireThenImport<typeof webpackMerge>("webpack-merge");
      const loadedOptions = loadedConfigs.flatMap((config) => config.options);

      if (loadedOptions.length > 0) {
        const prevPaths = configPaths.get(config);
        const loadedPaths = loadedConfigs.flatMap((config) => config.path);

        if (prevPaths) {
          const intersection = loadedPaths.filter((element) => prevPaths.includes(element));

          if (intersection.length > 0) {
            this.logger.error(`Recursive configuration detected, exiting.`);
            process.exit(2);
          }
        }

        config = merge(
          ...(loadedOptions as [WebpackConfiguration, ...WebpackConfiguration[]]),
          config,
        );

        if (prevPaths) {
          configPaths.set(config, [...prevPaths, ...loadedPaths]);
        }
      }

      if (config.extends) {
        const extendsPaths = typeof config.extends === "string" ? [config.extends] : config.extends;

        config = await resolveExtends(config, configPaths, extendsPaths);
      }

      return config;
    };

    // The `extends` param in CLI gets priority over extends in config file
    if (options.extends && options.extends.length > 0) {
      const extendsPaths = options.extends;

      if (Array.isArray(config.options)) {
        config.options = await Promise.all(
          config.options.map((options) => resolveExtends(options, config.path, extendsPaths)),
        );
      } else {
        // load the config from the extends option
        config.options = await resolveExtends(config.options, config.path, extendsPaths);
      }
    }
    // if no extends option is passed, check if the config file has extends
    else if (Array.isArray(config.options) && config.options.some((options) => options.extends)) {
      config.options = await Promise.all(
        config.options.map((options) => {
          if (options.extends) {
            return resolveExtends(
              options,
              config.path,
              typeof options.extends === "string" ? [options.extends] : options.extends,
            );
          } else {
            return options;
          }
        }),
      );
    } else if (!Array.isArray(config.options) && config.options.extends) {
      config.options = await resolveExtends(
        config.options,
        config.path,
        typeof config.options.extends === "string"
          ? [config.options.extends]
          : config.options.extends,
      );
    }

    if (options.merge) {
      const merge = await this.tryRequireThenImport<typeof webpackMerge>("webpack-merge");

      // we can only merge when there are multiple configurations
      // either by passing multiple configs by flags or passing a
      // single config exporting an array
      if (!Array.isArray(config.options) || config.options.length <= 1) {
        this.logger.error("At least two configurations are required for merge.");
        process.exit(2);
      }

      const mergedConfigPaths: string[] = [];

      config.options = config.options.reduce((accumulator: object, options) => {
        const configPath = config.path.get(options);
        const mergedOptions = merge(accumulator, options);

        if (configPath) {
          mergedConfigPaths.push(...configPath);
        }

        return mergedOptions;
      }, {});
      config.path.set(config.options, mergedConfigPaths);
    }

    return config;
  }