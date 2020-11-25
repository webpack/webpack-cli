const path = require('path');
const packageExists = require('./utils/package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const webpackMerge = require('webpack-merge');
const { writeFileSync, existsSync } = require('fs');
const { options: coloretteOptions, yellow } = require('colorette');

const logger = require('./utils/logger');
const { flags, flagsFromCore } = require('./utils/cli-flags');
const argParser = require('./utils/arg-parser');
const CLIPlugin = require('./plugins/CLIPlugin');
const promptInstallation = require('./utils/prompt-installation');
const { extensions, jsVariants } = require('interpret');
const rechoir = require('rechoir');

const toKebabCase = require('./utils/to-kebab-case');

const { resolve, extname } = path;

class WebpackCLI {
    constructor() {}

    async resolveConfig(args) {
        const loadConfig = (configPath) => {
            const ext = extname(configPath);
            const interpreted = Object.keys(jsVariants).find((variant) => variant === ext);

            if (interpreted) {
                rechoir.prepare(extensions, configPath);
            }

            let options;

            try {
                options = require(configPath);
            } catch (error) {
                logger.error(`Failed to load '${configPath}'`);
                logger.error(error);
                process.exit(2);
            }

            if (options.default) {
                options = options.default;
            }

            return { options, path: configPath };
        };

        const evaluateConfig = async (loadedConfig, args) => {
            const isMultiCompiler = Array.isArray(loadedConfig.options);
            const config = isMultiCompiler ? loadedConfig.options : [loadedConfig.options];

            let evaluatedConfig = await Promise.all(
                config.map(async (rawConfig) => {
                    if (typeof rawConfig.then === 'function') {
                        rawConfig = await rawConfig;
                    }

                    // `Promise` may return `Function`
                    if (typeof rawConfig === 'function') {
                        // when config is a function, pass the env from args to the config function
                        rawConfig = await rawConfig(args.env, args);
                    }

                    return rawConfig;
                }),
            );

            loadedConfig.options = isMultiCompiler ? evaluatedConfig : evaluatedConfig[0];

            const isObject = (value) => typeof value === 'object' && value !== null;

            if (!isObject(loadedConfig.options) && !Array.isArray(loadedConfig.options)) {
                logger.error(`Invalid configuration in '${loadedConfig.path}'`);
                process.exit(2);
            }

            return loadedConfig;
        };

        let config = { options: {}, path: new WeakMap() };

        if (args.config && args.config.length > 0) {
            const evaluatedConfigs = await Promise.all(
                args.config.map(async (value) => {
                    const configPath = resolve(value);

                    if (!existsSync(configPath)) {
                        logger.error(`The specified config file doesn't exist in '${configPath}'`);
                        process.exit(2);
                    }

                    const loadedConfig = loadConfig(configPath);

                    return evaluateConfig(loadedConfig, args);
                }),
            );

            if (evaluatedConfigs.length > 1) {
                config.options = [];

                evaluatedConfigs.forEach((evaluatedConfig) => {
                    if (Array.isArray(evaluatedConfig.options)) {
                        evaluatedConfig.options.forEach((options) => {
                            config.options.push(options);
                            config.path.set(options, evaluatedConfig.path);
                        });
                    } else {
                        config.options.push(evaluatedConfig.options);
                        config.path.set(evaluatedConfig.options, evaluatedConfig.path);
                    }
                });
            } else {
                config.options = evaluatedConfigs[0].options;
                config.path.set(evaluatedConfigs[0].options, evaluatedConfigs[0].path);
            }
        } else {
            // Order defines the priority, in increasing order
            const defaultConfigFiles = ['webpack.config', '.webpack/webpack.config', '.webpack/webpackfile']
                // .filter((value) => value.includes(args.mode))
                .map((filename) =>
                    // Since .cjs is not available on interpret side add it manually to default config extension list
                    [...Object.keys(extensions), '.cjs'].map((ext) => ({
                        path: resolve(filename + ext),
                        ext: ext,
                        module: extensions[ext],
                    })),
                )
                .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);

            let foundDefaultConfigFile;

            for (const defaultConfigFile of defaultConfigFiles) {
                if (existsSync(defaultConfigFile.path)) {
                    foundDefaultConfigFile = defaultConfigFile;
                    break;
                }
            }

            if (foundDefaultConfigFile) {
                const loadedConfig = loadConfig(foundDefaultConfigFile.path);
                const evaluatedConfig = await evaluateConfig(loadedConfig, args);

                config.options = evaluatedConfig.options;
                config.path.set(evaluatedConfig.options, evaluatedConfig.path);
            }
        }

        if (args.configName) {
            // TODO refactor
            const foundConfigNames = [];

            if (Array.isArray(config.options)) {
                config.options = config.options.filter((options) => {
                    let found;

                    if (args.configName.includes(options.name)) {
                        found = config;
                    }

                    if (found) {
                        foundConfigNames.push(options.name);

                        return true;
                    }

                    return false;
                });
                config.options = config.options.length === 1 ? config.options[0] : config.options;
            } else {
                const found = args.configName.includes(config.options.name);

                if (found) {
                    foundConfigNames.push(config.options.name);
                }
            }

            // TODO improve this for same names
            if (foundConfigNames.length !== args.configName.length) {
                logger.error(
                    args.configName
                        .filter((name) => !foundConfigNames.includes(name))
                        .map((configName) => `Configuration with name "${configName}" was not found.`)
                        .join('\n'),
                );
                process.exit(2);
            }

            if (config.options.length === 0) {
                logger.error('No configurations found');
                process.exit(2);
            }
        }

        if (args.merge) {
            // we can only merge when there are multiple configurations
            // either by passing multiple configs by flags or passing a
            // single config exporting an array
            if (!Array.isArray(config.options) || config.options.length <= 1) {
                logger.error('At least two configurations are required for merge.');
                process.exit(2);
            }

            const mergedConfigPaths = [];

            // TODO need to implement the `--merge-strategy` flag
            config.options = config.options.reduce((accumulator, options) => {
                const configPath = config.path.get(options);
                const mergedOptions = webpackMerge(accumulator, options);

                mergedConfigPaths.push(configPath);

                return mergedOptions;
            }, {});
            config.path.set(config.options, mergedConfigPaths);
        }

        return config;
    }

    async resolveArguments(config, args) {
        if (args.analyze) {
            if (!packageExists('webpack-bundle-analyzer')) {
                try {
                    await promptInstallation('webpack-bundle-analyzer', () => {
                        logger.error(`It looks like ${yellow('webpack-bundle-analyzer')} is not installed.`);
                    });
                } catch (error) {
                    logger.error(`Action Interrupted, Please try once again or install ${yellow('webpack-bundle-analyzer')} manually.`);
                    process.exit(2);
                }

                logger.success(`${yellow('webpack-bundle-analyzer')} was installed successfully.`);
            }
        }

        if (Object.keys(args).length === 0 && !process.env.NODE_ENV) {
            return config;
        }

        const coreCliHelper = require('webpack').cli;

        // TODO bug in duplicate args from core + custom for v4
        if (coreCliHelper) {
            const processArguments = (options) => {
                const coreFlagMap = flagsFromCore.reduce((accumulator, item) => {
                    accumulator.set(item.name, item);

                    return accumulator;
                }, new Map());
                const coreConfig = Object.keys(args)
                    .filter((arg) => coreFlagMap.has(toKebabCase(arg)))
                    .reduce((accumulator, current) => {
                        accumulator[toKebabCase(current)] = args[current];

                        return accumulator;
                    }, {});
                // TODO avoid using extra `getArguments`, we already run it before
                const coreCliArgs = coreCliHelper.getArguments();
                const problems = coreCliHelper.processArguments(coreCliArgs, options, coreConfig);

                if (problems) {
                    problems.forEach((problem) => {
                        // TODO better error
                        logger.error(
                            `Found the '${problem.type}' problem with the '--${problem.argument}' argument${
                                problem.path ? ` by path '${problem.path}'` : ''
                            }`,
                        );
                    });

                    process.exit(2);
                }

                return options;
            };

            config.options = Array.isArray(config.options)
                ? config.options.map((options) => processArguments(options))
                : processArguments(config.options);
        }

        const setupDefaultOptions = (options) => {
            if (options.cache && options.cache.type === 'filesystem' && config.path) {
                const configPath = config.path.get(options);

                if (configPath) {
                    if (!options.cache.buildDependencies) {
                        options.cache.buildDependencies = {};
                    }

                    if (!options.cache.buildDependencies.config) {
                        options.cache.buildDependencies.config = [];
                    }

                    if (Array.isArray(configPath)) {
                        configPath.forEach((item) => {
                            options.cache.buildDependencies.config.push(item);
                        });
                    } else {
                        options.cache.buildDependencies.config.push(configPath);
                    }
                }
            }

            return options;
        };

        config.options = Array.isArray(config.options)
            ? config.options.map((options) => setupDefaultOptions(options))
            : setupDefaultOptions(config.options);

        // Logic for webpack@4
        // TODO remove after drop webpack@4
        const processLegacyArguments = (options) => {
            if (args.entry) {
                options.entry = args.entry;
            }

            if (args.outputPath) {
                options.output = { ...options.output, ...{ path: path.resolve(args.outputPath) } };
            }

            if (args.target) {
                options.target = args.target;
            }

            if (args.devtool) {
                options.devtool = args.devtool;
            }

            if (args.mode) {
                options.mode = args.mode;
            } else if (
                !options.mode &&
                process.env &&
                process.env.NODE_ENV &&
                (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'node')
            ) {
                options.mode = process.env.NODE_ENV;
            }

            if (args.name) {
                options.name = args.name;
            }

            if (typeof args.stats !== 'undefined') {
                options.stats = args.stats;
            }

            if (typeof args.watch !== 'undefined') {
                options.watch = args.watch;
            }

            return options;
        };

        config.options = Array.isArray(config.options)
            ? config.options.map((options) => processLegacyArguments(options))
            : processLegacyArguments(config.options);

        return config;
    }

    async resolveCLIPlugin(config, args) {
        const addCLIPlugin = (options) => {
            if (!options.plugins) {
                options.plugins = [];
            }

            options.plugins.unshift(
                new CLIPlugin({
                    configPath: config.path,
                    helpfulOutput: !args.json,
                    hot: args.hot,
                    progress: args.progress,
                    prefetch: args.prefetch,
                    analyze: args.analyze,
                }),
            );

            return options;
        };

        config.options = Array.isArray(config.options)
            ? config.options.map((options) => addCLIPlugin(options))
            : addCLIPlugin(config.options);

        return config;
    }

    async resolve(parsedArgs) {
        let config = await this.resolveConfig(parsedArgs);

        config = await this.resolveArguments(config, parsedArgs);
        config = await this.resolveCLIPlugin(config, parsedArgs);

        return config;
    }

    /**
     * Expose commander argParser
     * @param  {...any} args args for argParser
     */
    argParser(...args) {
        return argParser(...args);
    }

    getCoreFlags() {
        return flags;
    }

    handleError(error) {
        // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
        // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
        const ValidationError = webpack.ValidationError || webpack.WebpackOptionsValidationError;

        // In case of schema errors print and exit process
        // For webpack@4 and webpack@5
        if (error instanceof ValidationError) {
            logger.error(error.message);
        } else {
            logger.error(error);
        }
    }

    createCompiler(options, callback) {
        let compiler;

        try {
            compiler = webpack(options, callback);
        } catch (error) {
            this.handleError(error);
            process.exit(2);
        }

        return compiler;
    }

    async getCompiler(args) {
        // TODO test with serve
        const config = await this.resolve(args);

        return this.createCompiler(config.options);
    }

    async run(args) {
        let compiler;

        const callback = (error, stats) => {
            if (error) {
                this.handleError(error);
                process.exit(2);
            }

            if (stats.hasErrors()) {
                process.exitCode = 1;
            }

            const getStatsOptions = (stats) => {
                // TODO remove after drop webpack@4
                if (webpack.Stats && webpack.Stats.presetToOptions) {
                    if (!stats) {
                        stats = {};
                    } else if (typeof stats === 'boolean' || typeof stats === 'string') {
                        stats = webpack.Stats.presetToOptions(stats);
                    }
                }

                let colors;

                // From flags
                if (typeof args.color !== 'undefined') {
                    colors = args.color;
                }
                // From stats
                else if (typeof stats.colors !== 'undefined') {
                    colors = stats.colors;
                }
                // Default
                else {
                    colors = coloretteOptions.enabled;
                }

                stats.colors = colors;

                return stats;
            };

            const getStatsOptionsFromCompiler = (compiler) => getStatsOptions(compiler.options ? compiler.options.stats : undefined);

            if (!compiler) {
                return;
            }

            const foundStats = compiler.compilers
                ? { children: compiler.compilers.map(getStatsOptionsFromCompiler) }
                : getStatsOptionsFromCompiler(compiler);

            if (args.json === true) {
                process.stdout.write(JSON.stringify(stats.toJson(foundStats), null, 2) + '\n');
            } else if (typeof args.json === 'string') {
                const JSONStats = JSON.stringify(stats.toJson(foundStats), null, 2);

                try {
                    writeFileSync(args.json, JSONStats);

                    logger.success(`stats are successfully stored as json to ${args.json}`);
                } catch (error) {
                    logger.error(error);

                    process.exit(2);
                }
            } else {
                const printedStats = stats.toString(foundStats);

                // Avoid extra empty line when `stats: 'none'`
                if (printedStats) {
                    logger.raw(`${stats.toString(foundStats)}`);
                }
            }
        };

        const config = await this.resolve(args);

        compiler = this.createCompiler(config.options, callback);

        // TODO webpack@4 return Watching and MultiWathing instead Compiler and MultiCompiler, remove this after drop webpack@4
        if (compiler && compiler.compiler) {
            compiler = compiler.compiler;
        }

        return Promise.resolve();
    }
}

module.exports = WebpackCLI;
