const { join, resolve, parse } = require('path');
const { existsSync } = require('fs');
const GroupHelper = require('./utils/group-helper');
const Compiler = require('./utils/compiler');

const webpackMerge = require('webpack-merge');

class webpackCLI extends GroupHelper {
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

    checkDefaults(groupResult) {
        const { options } = groupResult;
        if(options.entry && options.entry === './index.js') {
            const normalizedEntry = resolve(options.entry);
            if(!existsSync(normalizedEntry)) {
                try {
                    const parsedPath = parse(normalizedEntry);
                    const secondEntryDefault = join(parsedPath.dir, 'src', 'index.js');
                    if(existsSync(secondEntryDefault)) {
                        groupResult.options.entry = secondEntryDefault;
                    }
                } catch(err) {
                    groupResult.options.entry = normalizedEntry;
                }
            }
        }
        return groupResult;
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

    runOptionGroups() {
        let groupResult = {
            options: {},
            outputOptions: {},
            processingErrors: [],
        };

        const tmpGroupResult = this.groups.map(Group => Group.run()).filter(e => e);
        tmpGroupResult.forEach((e, idx) => {
            let groupObject = tmpGroupResult[idx + 1];
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

            groupResult.options = webpackMerge(groupResult.options, e.options);
        });
        const isDevMode = groupResult.outputOptions['dev'];
        return require('./utils/zero-config')(groupResult, isDevMode);
    }

    async run(args, yargsOptions) {
        await this.setMappedGroups(args, yargsOptions);
        await this.resolveGroups();
        let groupResult = await this.runOptionGroups();
        groupResult = this.checkDefaults(groupResult);
        const webpack = await Compiler(groupResult, this.shouldUseMem);
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
        return require('./commands/external').run(command.name, ...args);
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

module.exports = webpackCLI;
