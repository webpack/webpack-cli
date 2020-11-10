const path = require('path');
const packageExists = require('./utils/package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const webpackMerge = require('webpack-merge');
const { writeFileSync, existsSync } = require('fs');
const { options: coloretteOptions, yellow } = require('colorette');

const logger = require('./utils/logger');
const { core, groups, coreFlagMap } = require('./utils/cli-flags');
const argParser = require('./utils/arg-parser');
const assignFlagDefaults = require('./utils/flag-defaults');
const WebpackCLIPlugin = require('./plugins/WebpackCLIPlugin');
const promptInstallation = require('./utils/prompt-installation');
const { extensions, jsVariants } = require('interpret');
const rechoir = require('rechoir');

const { toKebabCase } = require('./utils/arg-utils');

const { resolve, extname } = path;

class WebpackCLI {
    constructor() {
        this.compilerConfiguration = {};
        this.outputConfiguration = {};
    }

    /**
     * Responsible for handling flags coming from webpack/webpack
     * @private\
     * @returns {void}
     */
    _handleCoreFlags(parsedArgs) {
        const coreCliHelper = require('webpack').cli;
        if (!coreCliHelper) return;
        const coreConfig = Object.keys(parsedArgs)
            .filter((arg) => {
                return coreFlagMap.has(toKebabCase(arg));
            })
            .reduce((acc, cur) => {
                acc[toKebabCase(cur)] = parsedArgs[cur];
                return acc;
            }, {});
        const coreCliArgs = coreCliHelper.getArguments();
        // Merge the core flag config with the compilerConfiguration
        coreCliHelper.processArguments(coreCliArgs, this.compilerConfiguration, coreConfig);
        // Assign some defaults to core flags
        const configWithDefaults = assignFlagDefaults(this.compilerConfiguration, parsedArgs, this.outputConfiguration);
        this._mergeOptionsToConfiguration(configWithDefaults);
    }

    async resolveArgs(args, configOptions = {}) {
        // when there are no args then exit
        // eslint-disable-next-line no-prototype-builtins
        if (Object.keys(args).length === 0 && !process.env.NODE_ENV) return {};

        const { outputPath, stats, json, mode, target, prefetch, hot, analyze } = args;
        const finalOptions = {
            options: {},
            outputOptions: {},
        };

        const WEBPACK_OPTION_FLAGS = core
            .filter((coreFlag) => {
                return coreFlag.group === groups.BASIC_GROUP;
            })
            .reduce((result, flagObject) => {
                result.push(flagObject.name);
                if (flagObject.alias) {
                    result.push(flagObject.alias);
                }
                return result;
            }, []);

        const PRODUCTION = 'production';
        const DEVELOPMENT = 'development';

        /*
        Mode priority:
            - Mode flag
            - Mode from config
            - Mode form NODE_ENV
        */

        /**
         *
         * @param {string} mode - mode flag value
         * @param {Object} configObject - contains relevant loaded config
         */
        const assignMode = (mode, configObject) => {
            const {
                env: { NODE_ENV },
            } = process;
            const { mode: configMode } = configObject;
            let finalMode;
            if (mode) {
                finalMode = mode;
            } else if (configMode) {
                finalMode = configMode;
            } else if (NODE_ENV && (NODE_ENV === PRODUCTION || NODE_ENV === DEVELOPMENT)) {
                finalMode = NODE_ENV;
            } else {
                finalMode = PRODUCTION;
            }
            return finalMode;
        };

        Object.keys(args).forEach((arg) => {
            if (WEBPACK_OPTION_FLAGS.includes(arg)) {
                finalOptions.outputOptions[arg] = args[arg];
            }
            if (arg === 'devtool') {
                finalOptions.options.devtool = args[arg];
            }
            if (arg === 'name') {
                finalOptions.options.name = args[arg];
            }
            if (arg === 'watch') {
                finalOptions.options.watch = true;
            }
            if (arg === 'entry') {
                finalOptions.options[arg] = args[arg];
            }
        });
        if (outputPath) {
            finalOptions.options.output = { path: path.resolve(outputPath) };
        }

        if (stats !== undefined) {
            finalOptions.options.stats = stats;
        }
        if (json) {
            finalOptions.outputOptions.json = json;
        }

        if (hot) {
            const { HotModuleReplacementPlugin } = require('webpack');
            const hotModuleVal = new HotModuleReplacementPlugin();
            if (finalOptions.options && finalOptions.options.plugins) {
                finalOptions.options.plugins.unshift(hotModuleVal);
            } else {
                finalOptions.options.plugins = [hotModuleVal];
            }
        }
        if (prefetch) {
            const { PrefetchPlugin } = require('webpack');
            const prefetchVal = new PrefetchPlugin(null, args.prefetch);
            if (finalOptions.options && finalOptions.options.plugins) {
                finalOptions.options.plugins.unshift(prefetchVal);
            } else {
                finalOptions.options.plugins = [prefetchVal];
            }
        }
        if (analyze) {
            if (packageExists('webpack-bundle-analyzer')) {
                // eslint-disable-next-line node/no-extraneous-require
                const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
                const bundleAnalyzerVal = new BundleAnalyzerPlugin();
                if (finalOptions.options && finalOptions.options.plugins) {
                    finalOptions.options.plugins.unshift(bundleAnalyzerVal);
                } else {
                    finalOptions.options.plugins = [bundleAnalyzerVal];
                }
            } else {
                await promptInstallation('webpack-bundle-analyzer', () => {
                    logger.error(`It looks like ${yellow('webpack-bundle-analyzer')} is not installed.`);
                })
                    .then(() => logger.success(`${yellow('webpack-bundle-analyzer')} was installed sucessfully.`))
                    .catch(() => {
                        logger.error(`Action Interrupted, Please try once again or install ${yellow('webpack-bundle-analyzer')} manually.`);
                        process.exit(2);
                    });
            }
        }
        if (target) {
            finalOptions.options.target = args.target;
        }

        if (Array.isArray(configOptions)) {
            // Todo - handle multi config for all flags
            finalOptions.options = configOptions.map(() => ({ ...finalOptions.options }));
            configOptions.forEach((configObject, index) => {
                finalOptions.options[index].mode = assignMode(mode, configObject);
            });
        } else {
            finalOptions.options.mode = assignMode(mode, configOptions);
        }
        return finalOptions;
    }

    async resolveConfig(args) {
        // Order defines the priority, in increasing order
        // example - config file lookup will be in order of .webpack/webpack.config.development.js -> webpack.config.development.js -> webpack.config.js
        const DEFAULT_CONFIG_LOC = [
            'webpack.config',
            'webpack.config.dev',
            'webpack.config.development',
            'webpack.config.prod',
            'webpack.config.production',
            '.webpack/webpack.config',
            '.webpack/webpack.config.none',
            '.webpack/webpack.config.dev',
            '.webpack/webpack.config.development',
            '.webpack/webpack.config.prod',
            '.webpack/webpack.config.production',
            '.webpack/webpackfile',
        ];

        const modeAlias = {
            production: 'prod',
            development: 'dev',
        };

        let opts = {
            outputOptions: {},
            options: {},
        };

        // Return a list of default configs in various formats
        const getDefaultConfigFiles = () => {
            return DEFAULT_CONFIG_LOC.map((filename) => {
                // Since .cjs is not available on interpret side add it manually to default config extension list
                return [...Object.keys(extensions), '.cjs'].map((ext) => {
                    return {
                        path: resolve(filename + ext),
                        ext: ext,
                        module: extensions[ext],
                    };
                });
            }).reduce((a, i) => a.concat(i), []);
        };

        const getConfigInfoFromFileName = (filename) => {
            const ext = extname(filename);
            // since we support only one config for now
            const allFiles = [filename];
            // return all the file metadata
            return allFiles
                .map((file) => {
                    return {
                        path: resolve(file),
                        ext: ext,
                        module: extensions[ext] || null,
                    };
                })
                .filter((e) => existsSync(e.path));
        };

        // Reads a config file given the config metadata
        const requireConfig = (configModule) => {
            const extension = Object.keys(jsVariants).find((t) => configModule.ext.endsWith(t));

            if (extension) {
                rechoir.prepare(extensions, configModule.path, process.cwd());
            }

            let config = require(configModule.path);

            if (config.default) {
                config = config.default;
            }

            return { config, path: configModule.path };
        };

        // Given config data, determines the type of config and
        // returns final config
        const finalize = async (moduleObj, args, isDefaultConfig = false) => {
            const { env, configName } = args;
            const newOptionsObject = {
                outputOptions: {},
                options: {},
            };

            if (!moduleObj) {
                return newOptionsObject;
            }

            if (isDefaultConfig) {
                newOptionsObject.outputOptions.defaultConfig = moduleObj.path;
            }

            const config = moduleObj.config;

            const isMultiCompilerMode = Array.isArray(config);
            const rawConfigs = isMultiCompilerMode ? config : [config];

            let configs = [];

            const allConfigs = await Promise.all(
                rawConfigs.map(async (rawConfig) => {
                    const isPromise = typeof rawConfig.then === 'function';

                    if (isPromise) {
                        rawConfig = await rawConfig;
                    }

                    // `Promise` may return `Function`
                    if (typeof rawConfig === 'function') {
                        // when config is a function, pass the env from args to the config function
                        rawConfig = await rawConfig(env, args);
                    }

                    return rawConfig;
                }),
            );

            for (const singleConfig of allConfigs) {
                if (Array.isArray(singleConfig)) {
                    configs.push(...singleConfig);
                } else {
                    configs.push(singleConfig);
                }
            }

            if (configName) {
                const foundConfigNames = [];

                configs = configs.filter((options) => {
                    const found = configName.includes(options.name);

                    if (found) {
                        foundConfigNames.push(options.name);
                    }

                    return found;
                });

                if (foundConfigNames.length !== configName.length) {
                    // Configuration with name "test" was not found.
                    logger.error(
                        configName
                            .filter((name) => !foundConfigNames.includes(name))
                            .map((configName) => `Configuration with name "${configName}" was not found.`)
                            .join('\n'),
                    );
                    process.exit(2);
                }
            }

            if (configs.length === 0) {
                logger.error('No configurations found');
                process.exit(2);
            }

            newOptionsObject['options'] = configs.length > 1 ? configs : configs[0];

            return newOptionsObject;
        };

        // Responsible for reading user configuration files
        // else does a default config lookup and resolves it.
        const { config, mode } = args;

        if (config && config.length > 0) {
            const resolvedOptions = [];
            const finalizedConfigs = config.map(async (webpackConfig) => {
                const configPath = resolve(webpackConfig);
                const configFiles = getConfigInfoFromFileName(configPath);

                if (!configFiles.length) {
                    logger.error(`The specified config file doesn't exist in ${configPath}`);
                    process.exit(2);
                }

                const foundConfig = configFiles[0];
                const resolvedConfig = requireConfig(foundConfig);

                return finalize(resolvedConfig, args);
            });

            // resolve all the configs
            for await (const resolvedOption of finalizedConfigs) {
                if (Array.isArray(resolvedOption.options)) {
                    resolvedOptions.push(...resolvedOption.options);
                } else {
                    resolvedOptions.push(resolvedOption.options);
                }
            }

            opts['options'] = resolvedOptions.length > 1 ? resolvedOptions : resolvedOptions[0] || {};
        } else {
            // When no config is supplied, lookup for default configs
            const defaultConfigFiles = getDefaultConfigFiles();
            const tmpConfigFiles = defaultConfigFiles.filter((file) => {
                return existsSync(file.path);
            });

            const configFiles = tmpConfigFiles.map(requireConfig);
            if (configFiles.length) {
                const defaultConfig = configFiles.find((p) => p.path.includes(mode) || p.path.includes(modeAlias[mode]));
                if (defaultConfig) {
                    opts = await finalize(defaultConfig, args, true);
                } else {
                    const foundConfig = configFiles.pop();

                    opts = await finalize(foundConfig, args, true);
                }
            }
        }

        const { merge } = args;

        if (merge) {
            // Get the current configuration options
            const { options: configOptions } = opts;

            // we can only merge when there are multiple configurations
            // either by passing multiple configs by flags or passing a
            // single config exporting an array
            if (!Array.isArray(configOptions)) {
                logger.error('At least two configurations are required for merge.');
                process.exit(2);
            }

            // We return a single config object which is passed to the compiler
            opts['options'] = configOptions.reduce((currentConfig, mergedConfig) => webpackMerge(currentConfig, mergedConfig), {});
        }

        return opts;
    }

    async _baseResolver(cb, parsedArgs, strategy) {
        const resolvedConfig = await cb(parsedArgs, this.compilerConfiguration);
        this._mergeOptionsToConfiguration(resolvedConfig.options, strategy);
        this._mergeOptionsToOutputConfiguration(resolvedConfig.outputOptions);
    }

    /**
     * Expose commander argParser
     * @param  {...any} args args for argParser
     */
    argParser(...args) {
        return argParser(...args);
    }

    getCoreFlags() {
        return core;
    }

    /**
     * Responsible to override webpack options.
     * @param {Object} options The options returned by a group helper
     * @param {Object} strategy The strategy to pass to webpack-merge. The strategy
     * is implemented inside the group helper
     * @private
     * @returns {void}
     */
    _mergeOptionsToConfiguration(options, strategy) {
        /**
         * options where they differ per config use this method to apply relevant option to relevant config
         * eg mode flag applies per config
         */
        if (Array.isArray(options) && Array.isArray(this.compilerConfiguration)) {
            this.compilerConfiguration = options.map((option, index) => {
                const compilerConfig = this.compilerConfiguration[index];
                if (strategy) {
                    return webpackMerge.strategy(strategy)(compilerConfig, option);
                }
                return webpackMerge(compilerConfig, option);
            });
            return;
        }

        /**
         * options is an array (multiple configuration) so we create a new
         * configuration where each element is individually merged
         */
        if (Array.isArray(options)) {
            this.compilerConfiguration = options.map((configuration) => {
                if (strategy) {
                    return webpackMerge.strategy(strategy)(this.compilerConfiguration, configuration);
                }
                return webpackMerge(this.compilerConfiguration, configuration);
            });
        } else {
            /**
             * The compiler configuration is already an array, so for each element
             * we merge the options
             */
            if (Array.isArray(this.compilerConfiguration)) {
                this.compilerConfiguration = this.compilerConfiguration.map((thisConfiguration) => {
                    if (strategy) {
                        return webpackMerge.strategy(strategy)(thisConfiguration, options);
                    }
                    return webpackMerge(thisConfiguration, options);
                });
            } else {
                if (strategy) {
                    this.compilerConfiguration = webpackMerge.strategy(strategy)(this.compilerConfiguration, options);
                } else {
                    this.compilerConfiguration = webpackMerge(this.compilerConfiguration, options);
                }
            }
        }
    }

    /**
     * Responsible for creating and updating the new  output configuration
     *
     * @param {Object} options Output options emitted by the group helper
     * @private
     * @returns {void}
     */
    _mergeOptionsToOutputConfiguration(options) {
        if (options) {
            this.outputConfiguration = Object.assign(this.outputConfiguration, options);
        }
    }

    /**
     * It runs in a fancy order all the expected groups.
     * Zero config and configuration goes first.
     *
     * The next groups will override existing parameters
     * @returns {Promise<void>} A Promise
     */
    async runOptionGroups(parsedArgs) {
        await Promise.resolve()
            .then(() => this._baseResolver(this.resolveConfig, parsedArgs))
            .then(() => this._handleCoreFlags(parsedArgs))
            .then(() => this._baseResolver(this.resolveArgs, parsedArgs));
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
        await this.runOptionGroups(args);
        return this.createCompiler(this.compilerConfiguration);
    }

    async run(args) {
        await this.runOptionGroups(args);

        let compiler;

        let options = this.compilerConfiguration;
        let outputOptions = this.outputConfiguration;

        const isRawOutput = typeof outputOptions.json === 'undefined';

        if (isRawOutput) {
            const webpackCLIPlugin = new WebpackCLIPlugin({
                progress: outputOptions.progress,
            });

            const addPlugin = (options) => {
                if (!options.plugins) {
                    options.plugins = [];
                }
                options.plugins.unshift(webpackCLIPlugin);
            };
            if (Array.isArray(options)) {
                options.forEach(addPlugin);
            } else {
                addPlugin(options);
            }
        }

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

            const foundStats = compiler.compilers
                ? { children: compiler.compilers.map(getStatsOptionsFromCompiler) }
                : getStatsOptionsFromCompiler(compiler);

            if (outputOptions.json === true) {
                process.stdout.write(JSON.stringify(stats.toJson(foundStats), null, 2) + '\n');
            } else if (typeof outputOptions.json === 'string') {
                const JSONStats = JSON.stringify(stats.toJson(foundStats), null, 2);

                try {
                    writeFileSync(outputOptions.json, JSONStats);

                    logger.success(`stats are successfully stored as json to ${outputOptions.json}`);
                } catch (error) {
                    logger.error(error);

                    process.exit(2);
                }
            } else {
                logger.raw(`${stats.toString(foundStats)}`);
            }
        };

        compiler = this.createCompiler(options, callback);
        return Promise.resolve();
    }
}

module.exports = WebpackCLI;
