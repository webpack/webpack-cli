const { join } = require('path');
const { existsSync } = require('fs');
const GroupHelper = require('./utils/group-helper');
const Compiler = require('./utils/compiler');

const webpackMerge = require('webpack-merge');

class WebpackCLI extends GroupHelper {
    constructor() {
        super();
        this.groupMap = new Map();
        this.groups = [];
        this.processingErrors = [];
        this.shouldUseMem = false;
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

    checkDefaults(options) {
        const { resolve, parse } = require('path');
        const defaultEntry = 'index';
        const possibleFileNames = [
            `./${defaultEntry}`, `./${defaultEntry}.js`, `${defaultEntry}.js`, defaultEntry,
            `./src/${defaultEntry}`, `./src/${defaultEntry}.js`, `src/${defaultEntry}.js`
        ];
        if (options.entry && possibleFileNames.includes(options.entry)) {
            const absFilename = parse(options.entry);
            let tmpFileName = options.entry;
            if (absFilename.ext !== '.js') {
                tmpFileName += '.js';
            }
            const normalizedEntry = resolve(tmpFileName);
            if (!existsSync(normalizedEntry)) {
                const parsedPath = parse(normalizedEntry);
                const possibleEntries = possibleFileNames.map(f => {
                    return resolve(parsedPath.dir, f);
                }).filter(e => existsSync(e));

                if (possibleEntries.length) {
                    options.entry = possibleEntries[0];
                }

            }
        } else if (Array.isArray(options)) {
            return options.map(opt => this.checkDefaults(opt));
        }
        return options;
    }

    resolveGroups() {
        let mode;
        for (const [key, value] of this.groupMap.entries()) {
            const fileName = join(__dirname, 'groups', key);
            const GroupClass = require(fileName);
            if (key === 'config') {
                value.push({ mode: mode });
            }
            const GroupInstance = new GroupClass(value);
            if (key === 'basic') {
                if (GroupInstance.opts.outputOptions.dev) {
                    mode = 'dev';
                } else {
                    mode = 'prod';
                }
                this.groups.push(GroupInstance);
            } else {
                this.groups.push(GroupInstance);
            }
        }
    }

    async runOptionGroups() {
        let groupResult = {
            options: {},
            outputOptions: {},
            processingErrors: [],
        };

        const tmpGroupResult = this.groups.map(Group => Group.run()).filter(e => e);
        const resolvedResults = await Promise.all(tmpGroupResult);
        resolvedResults.forEach((e, idx) => {
            let groupObject = resolvedResults[idx + 1];
            if (e.processingErrors) {
                groupResult.processingErrors = groupResult.processingErrors.concat(...e.processingErrors);
            }
            if (!groupObject) {
                groupObject = {
                    outputOptions: {},
                    options: {}
                }
            }
            if (!groupObject.outputOptions) {
                groupObject.outputOptions = {};
            }

            groupResult.outputOptions = Object.assign(groupObject.outputOptions, e.outputOptions);
            if (Array.isArray(e.options)) {
                const defaultArrayOptions = e.options.map(arrayConfigObject => {
                    return webpackMerge(groupResult.options, arrayConfigObject);
                })
                groupResult.options = defaultArrayOptions;
                return;
            }
            if (Array.isArray(groupResult.options)) {
                const defaultArrayOptions = groupResult.options.map(arrayConfigObject => {
                    return webpackMerge(e.options, arrayConfigObject);
                })
                groupResult.options = defaultArrayOptions;
                return;
            }
            groupResult.options = webpackMerge(groupResult.options, e.options);
        });
        const wrappedConfig = require('./utils/zero-config')(groupResult);
        wrappedConfig.options = this.checkDefaults(wrappedConfig.options);
        return wrappedConfig;
    }

    async processArgs(args, yargsOptions) {
        await this.setMappedGroups(args, yargsOptions);
        await this.resolveGroups();
        const groupResult = await this.runOptionGroups();
        return groupResult;
    }

    async getCompiler(args, yargsOptions) {
        const groupResult = await this.processArgs(args, yargsOptions);
        return await Compiler.getCompiler(groupResult);
    }

    async run(args, yargsOptions) {
        const groupResult = await this.processArgs(args, yargsOptions);
        const webpack = await Compiler.webpackInstance(groupResult, this.shouldUseMem);
        return webpack;
    }

    async runCommand(command, ...args) {
        // TODO: rename and depreciate init
        if (command.name === 'create') {
            command.name = 'init';
        } else if (command.name === 'loader') {
            command.name = 'generate-loader';
        } else if (command.name === 'plugin') {
            command.name = 'generate-plugin';
        }
        return await require('./commands/external').run(command.name, ...args);
    }

    runHelp() {
        const HelpGroup = require('./groups/help');
        return new HelpGroup().outputHelp();
    }

    runVersion() {
        const HelpGroup = require('./groups/help');
        return new HelpGroup().outputVersion();
    }

}

module.exports = WebpackCLI;
