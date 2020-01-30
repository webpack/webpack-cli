const { resolve, parse, join } = require('path');
const { existsSync } = require('fs');
const GroupHelper = require('./utils/group-helper');
const { Compiler } = require('./utils/Compiler');

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
        this.compiler = new Compiler();
    }
    setMappedGroups(args, yargsOptions) {
        const { _all } = args;
        Object.keys(_all).forEach(key => {
            this.setGroupMap(key, _all[key], yargsOptions);
        });
    }
    setGroupMap(key, val, yargsOptions) {
        const opt = yargsOptions.find(opt => opt.name === key);
        const groupName = opt.group;
        const namePrefix = groupName.slice(0, groupName.length - 9).toLowerCase();
        if (this.groupMap.has(namePrefix)) {
            const pushToMap = this.groupMap.get(namePrefix);
            pushToMap.push({ [opt.name]: val });
        } else {
            this.groupMap.set(namePrefix, [{ [opt.name]: val }]);
        }
    }

    checkDefaults(options, outputOptions) {
        if (Array.isArray(options)) {
            return options.map(opt => this.checkDefaults(opt, outputOptions));
        }
        const defaultEntry = 'index';
        const possibleFileNames = [`./${defaultEntry}`, `./${defaultEntry}.js`, `${defaultEntry}.js`, defaultEntry, `./src/${defaultEntry}`, `./src/${defaultEntry}.js`, `src/${defaultEntry}.js`];
        if (options.entry && possibleFileNames.includes(options.entry)) {
            const absFilename = parse(options.entry);
            let tmpFileName = options.entry;
            if (absFilename.ext !== '.js') {
                tmpFileName += '.js';
            }
            const normalizedEntry = resolve(tmpFileName);
            if (!existsSync(normalizedEntry)) {
                const parsedPath = parse(normalizedEntry);
                const possibleEntries = possibleFileNames
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

    resolveGroups() {
        let mode;
        for (const [key, value] of this.groupMap.entries()) {
            const fileName = join(__dirname, 'groups', key);
            const GroupClass = require(fileName);
            if (key === 'config') {
                value.push({ mode });
            }
            const GroupInstance = new GroupClass(value);
            if (key === 'basic') {
                mode = GroupInstance.opts.outputOptions.dev ? 'dev' : 'prod';
            }
            this.groups.push(GroupInstance);
        }
    }

    async runOptionGroups() {
        const groupResult = {
            options: {},
            outputOptions: {},
            processingMessageBuffer: [],
        };

        const tmpGroupResult = this.groups.map(Group => Group.run()).filter(e => e);
        const resolvedResults = await Promise.all(tmpGroupResult);
        resolvedResults.forEach((e, idx) => {
            let groupObject = resolvedResults[idx + 1];
            if (e.processingMessageBuffer) {
                groupResult.processingMessageBuffer = groupResult.processingMessageBuffer.concat(...e.processingMessageBuffer);
            }
            if (!groupObject) {
                groupObject = {
                    outputOptions: {},
                    options: {},
                };
            }
            if (!groupObject.outputOptions) {
                groupObject.outputOptions = {};
            }

            groupResult.outputOptions = Object.assign(groupObject.outputOptions, e.outputOptions);
            if (Array.isArray(e.options)) {
                const defaultArrayOptions = e.options.map(arrayConfigObject => {
                    return webpackMerge(groupResult.options, arrayConfigObject);
                });
                groupResult.options = defaultArrayOptions;
                return;
            }
            if (Array.isArray(groupResult.options)) {
                const defaultArrayOptions = groupResult.options.map(arrayConfigObject => {
                    return webpackMerge(e.options, arrayConfigObject);
                });
                groupResult.options = defaultArrayOptions;
                return;
            }
            groupResult.options = webpackMerge(groupResult.options, e.options);
        });
        groupResult.options = this.checkDefaults(groupResult.options, groupResult.outputOptions);
        if (groupResult.outputOptions.defaults) {
            const wrappedConfig = require('./utils/zero-config')(groupResult);
            wrappedConfig.options = this.checkDefaults(wrappedConfig.options, wrappedConfig.outputOptions);
            return wrappedConfig;
        }
        return groupResult;
    }

    async processArgs(args, yargsOptions) {
        this.setMappedGroups(args, yargsOptions);
        this.resolveGroups();
        const groupResult = await this.runOptionGroups();
        return groupResult;
    }

    async run(args, yargsOptions) {
        const groupResult = await this.processArgs(args, yargsOptions);
        this.compiler.createCompiler(groupResult.options);
        const webpack = await this.compiler.webpackInstance(groupResult);
        return webpack;
    }

    async runCommand(command, ...args) {
        // TODO: rename and depreciate init
        return await require('./commands/external').run(defaultCommands[command.name], ...args);
    }

    runHelp(args) {
        const HelpGroup = require('./groups/help');
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
        const HelpGroup = require('./groups/help');
        return new HelpGroup().outputVersion();
    }
}

module.exports = WebpackCLI;
