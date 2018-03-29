module.exports = class GeneratePluginCommand {
	constructor() {
		this.name = "generate-plugin";
	}

	run() {
		return require("../generate-plugin/index.js")();
	}
};
