const { join } = require("path");
const ErrorHelper = require("./utils/error-helper");

class webpackCLI extends ErrorHelper {
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
	formatDashedArgs() {}

	resolveGroups() {
		for (const [key, value] of this.groupMap.entries()) {
			const fileName = join(__dirname, "groups", key);
			const GroupClass = require(fileName);
			const GroupInstance = new GroupClass(value);
			this.groups.push(GroupInstance);
		}
	}

	runOptionGroups() {
		return this.groups
			.map(Group => {
				const res = Group.run();
				if (res.err) {
					this.processingErrors.push(res.err);
					delete res.err;
				}
				return res;
			})
			.filter(e => e);
	}

	normalizeGroup(group) {
		return this.arrayToObject(group);
	}

	async run(args, yargsOptions) {
		await this.setMappedGroups(args, yargsOptions);
		await this.resolveGroups();
		const groupResult = await this.runOptionGroups();
		return {
			webpackOptions: this.normalizeGroup(groupResult),
			processingErrors: this.processingErrors
		};
	}
	async runCommand(command, flags, ...args) {
		if (command.scope === "external") {
			return require("./commands/external").run(command.name, ...args);
		}
		const InternalClass = require("./commands/internal");
		const CommandClass = new InternalClass(command, flags, ...args);
		// and return to compiler scope
		return CommandClass.run();
	}
}

module.exports = webpackCLI;
