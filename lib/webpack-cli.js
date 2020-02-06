const { resolve, parse } = require('path');
const { existsSync } = require('fs');
const GroupHelper = require('./utils/GroupHelper');
const { Compiler } = require('./utils/Compiler');
const { groups } = require('./utils/cli-flags');
const webpackMerge = require('webpack-merge');

const defaultCommands = {
    create: 'init',
    loader: 'generate-loader',
    plugin: 'generate-plugin',
    info: 'info',
    migrate: 'migrate',
    serve: 'serve',
};

class WebpackCLI extends GroupHelper {
    constructor() {
        super();
        this.groupMap = new Map();
        this.groups = [];
        this.processingMessageBuffer = [];
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
        this.compilerConfiguration = undefined;
        this.outputConfiguration = {};
    }
    setMappedGroups(args, inlineOptions) {
        const { _all } = args;
        Object.keys(_all).forEach(key => {
            this.setGroupMap(key, _all[key], inlineOptions);
        });
    }
    setGroupMap(key, val, inlineOptions) {
        const opt = inlineOptions.find(opt => opt.name === key);
        const groupName = opt.group;
        if (this.groupMap.has(groupName)) {
            const pushToMap = this.groupMap.get(groupName);
            pushToMap.push({ [opt.name]: val });
        } else {
            this.groupMap.set(groupName, [{ [opt.name]: val }]);
        }
    }

    checkDefaults(options, outputOptions) {
        if (Array.isArray(options)) {
            return options.map(opt => this.checkDefaults(opt, outputOptions));
        }
        if (options.entry && this.possibleFileNames.includes(options.entry)) {
            const absFilename = parse(options.entry);
            let tmpFileName = options.entry;
            if (absFilename.ext !== '.js') {
                tmpFileName += '.js';
            }
            const normalizedEntry = resolve(tmpFileName);
            if (!existsSync(normalizedEntry)) {
                const parsedPath = parse(normalizedEntry);
                const possibleEntries = this.possibleFileNames
                    .map(f => {
                        return resolve(parsedPath.dir, f);
                    })
                    .filter(e => existsSync(e));

                if (possibleEntries.length) {
                    options.entry = possibleEntries[0];
                }
            }
        }
        if (outputOptions.devtool) {
            options.devtool = outputOptions.devtool;
        }
        return options;
    }

    /**
     * Based on the parsed keys, the function will import and create
     * a group that handles respective values
     *
     * @returns {void}
     */
    resolveGroups() {
        let mode;
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
                case groups.CONFIG_GROUP: {
                    const ConfigGroup = require('./groups/ConfigGroup');
                    this.configGroup = new ConfigGroup([...value, { mode }]);
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
            this.compilerConfiguration = options.map(configuration => {
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
                this.compilerConfiguration = this.compilerConfiguration.map(thisConfiguration => {
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
     * Responsible for updating the buffer
     *
     * @param {string[]} messageBuffer The current buffer message
     * @private
     * @returns {void}
     */
    _mergeProcessingMessageBuffer(messageBuffer) {
        if (messageBuffer) {
            this.processingMessageBuffer = this.processingMessageBuffer.concat(...messageBuffer);
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
    _handleGroupHelper(groupHelper) {
        if (groupHelper) {
            const result = groupHelper.run();
            this._mergeOptionsToConfiguration(result.options, groupHelper.strategy);
            this._mergeOptionsToOutputConfiguration(result.outputOptions);
            this._mergeProcessingMessageBuffer(result.processingMessageBuffer);
        }
    }

    /**
     * Responsible for applying defaults, if necessary
     * @private
     * @returns {void}
     */
    _handForcedDefaults() {
        if (this.outputConfiguration.defaults) {
            const wrappedConfig = require('./utils/zero-config')(this.compilerConfiguration, this.outputConfiguration);
            this.compilerConfiguration = this.checkDefaults(wrappedConfig.options, this.outputConfiguration);
        }
    }

    /**
     * It runs in a fancy order all the expected groups.
     * Zero config and configuration goes first.
     *
     * The next groups will override existing parameters
     * @returns {Promise<void>} A Promise
     */
    async runOptionGroups() {
        await Promise.resolve()
            .then(() => this._handleGroupHelper(this.zeroConfigGroup))
            .then(() => this._handleGroupHelper(this.configGroup))
            .then(() => this._handleGroupHelper(this.outputGroup))
            .then(() => this._handleGroupHelper(this.basicGroup))
            .then(() => this._handleGroupHelper(this.advancedGroup))
            .then(() => this._handleGroupHelper(this.statsGroup))
            .then(() => this._handleGroupHelper(this.helpGroup))
            .then(() => this._handForcedDefaults());
    }

    async processArgs(args, cliOptions) {
        this.setMappedGroups(args, cliOptions);
        this.resolveGroups();
        const groupResult = await this.runOptionGroups();
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
            processingMessageBuffer: this.processingMessageBuffer,
        });
        return webpack;
    }

    async runCommand(command, ...args) {
        // TODO: rename and depreciate init
        return await require('./commands/external').run(defaultCommands[command.name], ...args);
    }

    runHelp(args) {
        const HelpGroup = require('./groups/HelpGroup');
        const commandNames = require('./utils/commands').names;
        const flagNames = require('./utils/core-flags').names;
        const allNames = [...commandNames, ...flagNames];
        const subject = allNames.filter(name => {
            return args.includes(name);
        })[0];
        const isCommand = commandNames.includes(subject);
        return new HelpGroup().outputHelp(isCommand, subject);
    }

    runVersion() {
        const HelpGroup = require('./groups/HelpGroup');
        return new HelpGroup().outputVersion();
    }
}

module.exports = WebpackCLI;
