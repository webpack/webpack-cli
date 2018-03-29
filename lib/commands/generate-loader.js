module.exports = class GenerateLoaderCommand {
	constructor() {
		this.name = "generate-loader";
	}

	run() {
		return require("../generate-loader/index")();
	}
};
