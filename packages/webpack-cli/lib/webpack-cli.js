const { options } = require('colorette');
const GroupHelper = require('./utils/GroupHelper');
const handleConfigResolution = require('./groups/ConfigGroup');
const { Compiler } = require('./utils/Compiler');
const { groups, core } = require('./utils/cli-flags');
const webpackMerge = require('webpack-merge');
const { toKebabCase } = require('./utils/helpers');
const argParser = require('./utils/arg-parser');

class WebpackCLI extends GroupHelper {
    constructor() {
        super();
        this.groupMap = new Map();
        this.groups = [];
        this.args = {};
        this.compilation = new Compiler();
        this.defaultEntry = 'index';
        this.possibleFileNames = [
            `./${this.defaultEntry}`,
            `./${this.defaultEntry}.js`,
            `${this.defaultEntry}.js`,
            this.defaultEntry,
            `./src/${this.defaultEntry}`,
            `./src/${this.defaultEntry}.js`,
            `src/${this.defaultEntry}.js`,
        ];
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
    _handleCoreFlags() {
        if (!this.groupMap.has('core')) {
            return;
        }
        const coreFlags = this.groupMap.get('core');

        // convert all the flags from map to single object
        const coreConfig = coreFlags.reduce((allFlag, curFlag) => ({ ...allFlag, ...curFlag }), {});

        const coreCliHelper = require('webpack').cli;
        const coreCliArgs = coreCliHelper.getArguments();
        // Merge the core flag config with the compilerConfiguration
        coreCliHelper.processArguments(coreCliArgs, this.compilerConfiguration, coreConfig);
    }

    /**
     * Responsible for resolving config
     * @private\
     * @param {Object} processed args
     * @returns {void}
     */
    async _handleConfig(parsedArgs) {
        const resolvedConfig = await handleConfigResolution(parsedArgs);
        this._mergeOptionsToConfiguration(resolvedConfig.options);
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
        for (const [key, value] of this.groupMap.entries()) {
            switch (key) {
                case groups.ZERO_CONFIG_GROUP: {
                    const ZeroConfigGroup = require('./groups/ZeroConfigGroup');
                    this.zeroConfigGroup = new ZeroConfigGroup(value);
                    break;
                }
                case groups.BASIC_GROUP: {
                    const BasicGroup = require('./groups/BasicGroup');
                    this.basicGroup = new BasicGroup(value);
                    break;
                }
                case groups.ADVANCED_GROUP: {
                    const AdvancedGroup = require('./groups/AdvancedGroup');
                    this.advancedGroup = new AdvancedGroup(value);
                    break;
                }
                case groups.DISPLAY_GROUP: {
                    const StatsGroup = require('./groups/StatsGroup');
                    this.statsGroup = new StatsGroup(value);
                    break;
                }
                case groups.HELP_GROUP: {
                    const HelpGroup = require('./groups/HelpGroup');
                    this.helpGroup = new HelpGroup();
                    break;
                }
                case groups.OUTPUT_GROUP: {
                    const OutputGroup = require('./groups/OutputGroup');
                    this.outputGroup = new OutputGroup(value);
                    this.groups.push(this.outputGroup);
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
     * Get the defaultEntry for merge with config rightly
     * @private
     * @returns {void}
     */
    _handleDefaultEntry() {
        if (!this.basicGroup) {
            const BasicGroup = require('./groups/BasicGroup');
            this.basicGroup = new BasicGroup();
        }
        const defaultEntry = this.basicGroup.resolveFilePath(null, 'index.js');
        const options = { entry: defaultEntry };
        this._mergeOptionsToConfiguration(options);
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
            .then(() => this._handleGroupHelper(this.zeroConfigGroup))
            .then(() => this._handleDefaultEntry())
            .then(() => this._handleConfig(parsedArgs))
            .then(() => this._handleGroupHelper(this.outputGroup))
            .then(() => this._handleCoreFlags())
            .then(() => this._handleGroupHelper(this.basicGroup))
            .then(() => this._handleGroupHelper(this.advancedGroup))
            .then(() => this._handleGroupHelper(this.statsGroup))
            .then(() => this._handleGroupHelper(this.helpGroup));
    }

    async processArgs(args, cliOptions) {
        this.setMappedGroups(args, cliOptions);
        this.resolveGroups(args);
        const groupResult = await this.runOptionGroups(args);
        return groupResult;
    }

    async getCompiler(args, cliOptions) {
        await this.processArgs(args, cliOptions);
        await this.compilation.createCompiler(this.compilerConfiguration);
        return this.compilation.compiler;
    }

    async run(args, cliOptions) {
        await this.processArgs(args, cliOptions);
        await this.compilation.createCompiler(this.compilerConfiguration);
        const webpack = await this.compilation.webpackInstance({
            options: this.compilerConfiguration,
            outputOptions: this.outputConfiguration,
        });
        return webpack;
    }

    runHelp(args) {
        const HelpGroup = require('./groups/HelpGroup');
        const { commands, allNames, hasUnknownArgs } = require('./utils/unknown-args');
        const subject = allNames.filter((name) => {
            return args.includes(name);
        })[0];
        const invalidArgs = hasUnknownArgs(args, ...allNames);
        const isCommand = commands.includes(subject);
        options.enabled = !args.includes('--no-color');
        return new HelpGroup().outputHelp(isCommand, subject, invalidArgs);
    }

    runVersion(args, externalPkg) {
        const HelpGroup = require('./groups/HelpGroup');
        const { commands, allNames, hasUnknownArgs } = require('./utils/unknown-args');
        const commandsUsed = args.filter((val) => commands.includes(val));
        const invalidArgs = hasUnknownArgs(args, ...allNames);
        options.enabled = !args.includes('--no-color');
        return new HelpGroup().outputVersion(externalPkg, commandsUsed, invalidArgs);
    }
}

module.exports = WebpackCLI;
