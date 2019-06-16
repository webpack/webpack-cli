class InternalCommand {
	interactive() {}
	help() {
		const HelpGroup = require('../groups/help');
		const HelpOutput = new HelpGroup().run();
		console.log(HelpOutput.outputOptions.help);
	}
	version() {
		const jsonPath = require('path').join(__dirname, '..', '..', 'package.json')
		const version = require(jsonPath, 'utf8').version
		console.log(`webpack-cli ${version}`);
	}
	analyze() {
		console.log("module")
	}
}

module.exports = InternalCommand;
