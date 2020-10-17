const { packageExists } = require('./utils/package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const logger = require('./utils/logger');
const webpackMerge = require('webpack-merge');
const GroupHelper = require('./utils/GroupHelper');
const { groups, core } = require('./utils/cli-flags');
const argParser = require('./utils/arg-parser');
const { outputStrategy } = require('./utils/merge-strategies');
const { toKebabCase } = require('./utils/helpers');
const assignFlagDefaults = require('./utils/flag-defaults');
const { writeFileSync } = require('fs');
const { options: coloretteOptions } = require('colorette');

// CLI arg resolvers
const handleConfigResolution = require('./groups/ConfigGroup');
const resolveMode = require('./groups/resolveMode');
const resolveStats = require('./groups/resolveStats');
const resolveOutput = require('./groups/resolveOutput');
const basicResolver = require('./groups/basicResolver');
const resolveAdvanced = require('./groups/resolveAdvanced');

class WebpackCLI extends GroupHelper {
    constructor() {
        super();
        this.groupMap = new Map();
        this.compilerConfiguration = {};
        this.outputConfiguration = {};
    }
    setMappedGroups(args, inlineOptions) {
        Object.keys(args).forEach((key) => {
            this.setGroupMap(toKebabCase(key), args[key], inlineOptions);
        });
    }
    setGroupMap(key, val, inlineOptions) {
        if (val === undefined) return;
        const opt = inlineOptions.find((opt) => opt.name === key);
        const groupName = opt.group;
        if (this.groupMap.has(groupName)) {
            const pushToMap = this.groupMap.get(groupName);
            pushToMap.push({ [opt.name]: val });
        } else {
            this.groupMap.set(groupName, [{ [opt.name]: val }]);
        }
    }

    /**
     * Responsible for handling flags coming from webpack/webpack
     * @private\
     * @returns {void}
     */
    _handleCoreFlags(parsedArgs) {
        if (this.groupMap.has('core')) {
            const coreFlags = this.groupMap.get('core');

            // convert all the flags from map to single object
            const coreConfig = coreFlags.reduce((allFlag, curFlag) => ({ ...allFlag, ...curFlag }), {});
            const coreCliHelper = require('webpack').cli;
            const coreCliArgs = coreCliHelper.getArguments();
            // Merge the core flag config with the compilerConfiguration
            coreCliHelper.processArguments(coreCliArgs, this.compilerConfiguration, coreConfig);
            // Assign some defaults to core flags
        }
        const configWithDefaults = assignFlagDefaults(this.compilerConfiguration, parsedArgs);
        this._mergeOptionsToConfiguration(configWithDefaults);
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
     * Based on the parsed keys, the function will import and create
     * a group that handles respective values
     *
     * @returns {void}
     */
    resolveGroups() {
        for (const [key] of this.groupMap.entries()) {
            switch (key) {
                case groups.HELP_GROUP: {
                    const HelpGroup = require('./groups/runHelp');
                    this.helpGroup = new HelpGroup();
                    break;
                }
            }
        }
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
     * It receives a group helper, it runs and it merges its result inside
     * the file result that will be passed to the compiler
     *
     * @param {GroupHelper?} groupHelper A group helper
     * @private
     * @returns {void}
     */
    async _handleGroupHelper(groupHelper) {
        if (groupHelper) {
            const result = await groupHelper.run();
            this._mergeOptionsToConfiguration(result.options, groupHelper.strategy);
            this._mergeOptionsToOutputConfiguration(result.outputOptions);
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
            .then(() => this._baseResolver(resolveMode, parsedArgs))
            .then(() => this._baseResolver(resolveOutput, parsedArgs, outputStrategy))
            .then(() => this._handleCoreFlags(parsedArgs))
            .then(() => this._baseResolver(basicResolver, parsedArgs))
            .then(() => this._baseResolver(resolveAdvanced, parsedArgs))
            .then(() => this._baseResolver(resolveStats, parsedArgs))
            .then(() => this._handleGroupHelper(this.helpGroup));
    }

    async processArgs(args, cliOptions) {
        this.setMappedGroups(args, cliOptions);
        this.resolveGroups(args);

        return this.runOptionGroups(args);
    }

    createCompiler(options) {
        let compiler;

        try {
            compiler = webpack(options);
        } catch (error) {
            // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
            // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
            const ValidationError = webpack.ValidationError ? webpack.ValidationError : webpack.WebpackOptionsValidationError;

            // In case of schema errors print and exit process
            // For webpack@4 and webpack@5
            if (error instanceof ValidationError) {
                logger.error(error.message);
            } else {
                logger.error(error);
            }

            process.exit(2);
        }

        return compiler;
    }

    async getCompiler(args, cliOptions) {
        await this.processArgs(args, cliOptions);

        return this.createCompiler(this.compilerConfiguration);
    }

    async run(args, cliOptions) {
        await this.processArgs(args, cliOptions);

        const compiler = this.createCompiler(this.compilerConfiguration);

        const options = this.compilerConfiguration;
        const outputOptions = this.outputConfiguration;

        if (outputOptions.interactive) {
            const interactive = require('./utils/interactive');

            return interactive(compiler, options, outputOptions);
        }

        const compilers = compiler.compilers ? compiler.compilers : [compiler];
        const isWatchMode = Boolean(compilers.find((compiler) => compiler.options.watch));
        const isRawOutput = typeof outputOptions.json === 'undefined';

        if (isRawOutput) {
            for (const compiler of compilers) {
                if (outputOptions.progress) {
                    const { ProgressPlugin } = webpack;

                    let progressPluginExists;

                    if (compiler.options.plugins) {
                        progressPluginExists = Boolean(compiler.options.plugins.find((e) => e instanceof ProgressPlugin));
                    }

                    if (!progressPluginExists) {
                        new ProgressPlugin().apply(compiler);
                    }
                }
            }

            compiler.hooks.watchRun.tap('watchInfo', (compilation) => {
                if (compilation.options.bail && isWatchMode) {
                    logger.warn('You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.');
                }

                logger.success(`Compilation${compilation.name ? `${compilation.name}` : ''} starting...`);
            });
            compiler.hooks.done.tap('watchInfo', (compilation) => {
                logger.success(`Compilation${compilation.name ? `${compilation.name}` : ''} finished`);
            });
        }

        const callback = (error, stats) => {
            if (error) {
                logger.error(error);
                process.exit(1);
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

            const foundStats = compiler.compilers
                ? { children: compiler.compilers.map((compiler) => getStatsOptions(compiler.options.stats)) }
                : getStatsOptions(compiler.options.stats);

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

            if (isWatchMode) {
                logger.success('watching files for updates...');
            }
        };

        if (isWatchMode) {
            const watchOptions = (compiler.options && compiler.options.watchOptions) || {};

            if (watchOptions.stdin) {
                process.stdin.on('end', function () {
                    process.exit();
                });
                process.stdin.resume();
            }

            return new Promise((resolve) => {
                compiler.watch(watchOptions, (error, stats) => {
                    callback(error, stats);

                    resolve();
                });
            });
        } else {
            return new Promise((resolve) => {
                compiler.run((error, stats) => {
                    if (compiler.close) {
                        compiler.close(() => {
                            callback(error, stats);

                            resolve();
                        });
                    } else {
                        callback(error, stats);

                        resolve();
                    }
                });
            });
        }
    }
}

module.exports = WebpackCLI;
