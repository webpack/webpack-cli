const webpackMerge = require('webpack-merge');
const { Compiler } = require('./utils/Compiler');
const { core, coreFlagMap } = require('./utils/cli-flags');
const argParser = require('./utils/arg-parser');
const { outputStrategy } = require('./utils/merge-strategies');
const assignFlagDefaults = require('./utils/flag-defaults');
const { toKebabCase } = require('./utils/helpers');

// CLI arg resolvers
const handleConfigResolution = require('./groups/ConfigGroup');
const resolveMode = require('./groups/resolveMode');
const resolveStats = require('./groups/resolveStats');
const resolveOutput = require('./groups/resolveOutput');
const basicResolver = require('./groups/basicResolver');
const resolveAdvanced = require('./groups/resolveAdvanced');

class WebpackCLI {
    constructor() {
        this.compilation = new Compiler();
        this.compilerConfiguration = {};
        this.outputConfiguration = {};
    }

    /**
     * Responsible for handling flags coming from webpack/webpack
     * @private\
     * @returns {void}
     */
    _handleCoreFlags(parsedArgs) {
        const coreConfig = Object.keys(parsedArgs)
            .filter((arg) => {
                return coreFlagMap.has(toKebabCase(arg));
            })
            .reduce((acc, cur) => {
                acc[toKebabCase(cur)] = parsedArgs[cur];
                return acc;
            }, {});
        const coreCliHelper = require('webpack').cli;
        const coreCliArgs = coreCliHelper.getArguments();
        // Merge the core flag config with the compilerConfiguration
        coreCliHelper.processArguments(coreCliArgs, this.compilerConfiguration, coreConfig);
        // Assign some defaults to core flags
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

    async getCompiler(args) {
        await this.runOptionGroups(args);
        await this.compilation.createCompiler(this.compilerConfiguration);
        return this.compilation.compiler;
    }

    async run(args) {
        await this.runOptionGroups(args);
        await this.compilation.createCompiler(this.compilerConfiguration);
        const webpack = await this.compilation.webpackInstance({
            options: this.compilerConfiguration,
            outputOptions: this.outputConfiguration,
        });
        return webpack;
    }
}

module.exports = WebpackCLI;
