const path = require('path');
const packageExists = require('./utils/package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const webpackMerge = require('webpack-merge');
const { writeFileSync } = require('fs');
const { options: coloretteOptions, yellow } = require('colorette');

const logger = require('./utils/logger');
const { core, groups, coreFlagMap } = require('./utils/cli-flags');
const argParser = require('./utils/arg-parser');
const assignFlagDefaults = require('./utils/flag-defaults');
const WebpackCLIPlugin = require('./plugins/WebpackCLIPlugin');
const InteractiveModePlugin = require('./utils/InteractiveModePlugin').InteractiveModePlugin;
const promptInstallation = require('./utils/prompt-installation');

// CLI arg resolvers
const handleConfigResolution = require('./groups/resolveConfig');
const toKebabCase = require('./utils/to-kebab-case');

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
        // Since color flag has a default value, when there are no other args then exit
        // eslint-disable-next-line no-prototype-builtins
        if (Object.keys(args).length === 1 && args.hasOwnProperty('color') && !process.env.NODE_ENV) return {};

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
            .then(() => this._baseResolver(handleConfigResolution, parsedArgs))
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

    createCompiler(options, callback, args) {
        let compiler;
        try {
            // enforce watch on interactive
            if (args.interactive) {
                if (Array.isArray(options)) {
                    for (const option of options) {
                        option.watch = true;
                    }
                } else {
                    options.watch = true;
                }
            }

            compiler = webpack(options, callback);

            // apply plugin is interactove is passed by user
            if (args.interactive) {
                const interactivePlugin = new InteractiveModePlugin();
                interactivePlugin.apply(compiler);
            }
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

                stats.colors = typeof stats.colors !== 'undefined' ? stats.colors : coloretteOptions.enabled;

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

        compiler = this.createCompiler(options, callback, args);
        return Promise.resolve();
    }
}

module.exports = WebpackCLI;
