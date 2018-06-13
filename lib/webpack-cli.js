const { join } = require("path");
const GroupHelper = require("./utils/group-helper");
const Compiler = require("./utils/compiler");

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

	resolveGroups() {
		let mode;
		for (const [key, value] of this.groupMap.entries()) {
			const fileName = join(__dirname, "groups", key);
			const GroupClass = require(fileName);
			if (key === "config") {
				value.push({ mode: mode });
			}
			const GroupInstance = new GroupClass(value);
			if (key === "basic") {
				if (GroupInstance.opts.outputOptions.dev) {
					mode = "dev";
				} else {
					mode = "prod";
				}
				this.groups.push(GroupInstance);
			} else {
				this.groups.push(GroupInstance);
			}
		}
	}

	mergeGroupResults(acc, curr) {
		if (curr.options) {
			acc.options = this.mergeRecursive(acc.options, curr.options);
		}
		if (curr.outputOptions) {
			acc.outputOptions = this.mergeRecursive(acc.outputOptions, curr.outputOptions);
		}
		if (curr.processingErrors) {
			acc.processingErrors = acc.processingErrors.concat(curr.processingErrors);
		}
		return acc;
	}

	runOptionGroups() {
		return this.groups
			.map(Group => Group.run())
			.filter(e => e)
			.reduce(this.mergeGroupResults.bind(this), {
				outputOptions: {},
				options: {},
				processingErrors: []
			});
	}

	async run(args, yargsOptions) {
		await this.setMappedGroups(args, yargsOptions);
		await this.resolveGroups();
		const groupResult = await this.runOptionGroups();
		const webpack = await Compiler(groupResult);
		return webpack;
	}

	async runCommand(command, ...args) {
		if (command.scope === "external") {
			// TODO: rename and depreciate init
			if (command.name === "create") {
				command.name = "init";
			} else if (command.name === "loader") {
				command.name = "generate-loader";
			} else if (command.name === "plugin") {
				command.name = "generate-plugin";
			}
			return require("./commands/external").run(command.name, ...args);
		}
		const InternalClass = require("./commands/internal");
		const CommandClass = new InternalClass(command, ...args);
		CommandClass[command.name]();
		return null;
	}
}

module.exports = webpackCLI;
