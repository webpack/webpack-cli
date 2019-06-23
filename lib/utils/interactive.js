const chalk = require('chalk');
const webpack = require('webpack');

const generateSingleOption = (option) => {
	const {key, description} = option;
	const optionString = chalk.gray(`> Press`) + ` ${chalk.bold.white(key)} ` + chalk.gray(`${description}\n`)
	return optionString;
}
const generateConfigDescription = (config) => {
	let configDescString = '\n';
	const headerString = chalk.bold.white("Interactive Usage");
	configDescString += headerString;
	configDescString += '\n';
	Object.keys(config).forEach( option => {
		configDescString+= generateSingleOption(config[option]);
	});
	configDescString += '\n'
	return configDescString;
}

const setupInteractive = () => {
	const usagePrompt = generateConfigDescription(interactiveConfig);
	console.clear()
	console.log(usagePrompt)
}

const interactiveConfig = [
	{
		key: 'a',
		description: 'Analyze build for performance improvements',
		onShowMore: []
	},
	{
		key: 'p',
		description: 'Pause compilation at a given time',
		onShowMore: []
	},
	{
		key: 'm',
		description: 'Filter a module and get stats on why a module was included',
		onShowMore: []
	},
	{
		key: 'Enter',
		description: 'Run webpack',
		onShowMore: []
	},
	{
		key: 'q',
		description: 'Exit interactive mode',
		onShowMore: []
	},
	{
		key: 'b',
		description: 'Go back to main menu',
	}
]

module.exports = function(config, outputOptions, processingErrors, shouldUsemem) {
const stdin = process.stdin;
stdin.setEncoding("utf-8");
stdin.setRawMode(true);
setupInteractive()


const EXIT_KEY = 'q';
const ANALYZE_KEY = 'a';
const FILTER_KEY = 'm'; 
const ENTER_KEY = '\n';
const B_KEY = 'b';

const isExitCtrl = (key) => (key.ctrl && key.name === 'c');
stdin.on('keypress', (str, key) => {
	if (isExitCtrl(key)) {
	  process.exit();
	}
});

stdin.on("data", function(data, key) {
	switch(data) {
		case EXIT_KEY:
			console.log("exit")
			process.exit(0);
		case ANALYZE_KEY:
			console.log("analyze ya")
			break;
		case FILTER_KEY:
			console.log("filtering modules")
			break;
		case B_KEY:
			console.clear();
			stdin.setEncoding("utf-8");
			stdin.setRawMode(true);
			setupInteractive()
			break;
		case ENTER_KEY:
			console.log("Running webpack");
			outputOptions.interactive = false;
			stdin.setRawMode(true);
			console.clear()
			return require('./compiler')({options: config, outputOptions, processingErrors}, shouldUsemem)
		default:
			stdin.setRawMode(false);
			break;
	}
});

}