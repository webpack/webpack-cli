#!/usr/bin/env node
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require('path');
var resolveCwd = require('resolve-cwd');
var yargs = require('yargs');
var localCLI = resolveCwd.silent('webpack-cli/bin/webpack');

if (localCLI && path.relative(localCLI, __filename) !== '') {
	require(localCLI);
} else {
	try {
		require('./webpack');
	} catch (err) {
		console.error(`\n  ${err.message}`);
		process.exitCode = 1;
	}
}

yargs
	.usage(`webpack-cli ${require('../package.json').version}

Usage: $0 <cmd> [args]

Usage without config file: webpack <entry> [<entry>] <output>
Usage with config file: webpack
`)
	.epilogue('for more information see https://webpack.github.io/docs/cli.html')
	.commandDir(path.join(__dirname, '..', 'commands'))
	.demandCommand(1, 'Command not specified. Try `webpack-cli start --help`')
	.help()
	.alias('help', 'h', '?')
	.version()
	.alias('version', 'v')
	.wrap(yargs.terminalWidth())
	.strict();

yargs.argv;
