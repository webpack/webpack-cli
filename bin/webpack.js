#!/usr/bin/env node

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require('path');
// var fs = require('fs');
// Local version replace global one

process.title = 'webpack';

try {
	var localWebpack = require.resolve(path.join(process.cwd(), 'node_modules', 'webpack-cli', 'bin', 'webpack.js'));
	if(localWebpack && path.relative(localWebpack, __filename) !== '') {
		return require(localWebpack);
	}
} catch(e) {
	/*
	// Delete Cache, Retry and leave it if the path isn`t valid.
	// swap with webpack-cli later
	var dirPath = path.join(process.cwd(), 'node_modules', 'webpack', 'bin');
	var retryLocal;
	fs.readdir(dirPath, function(err, files) {
		files.filter( (file) => {
			delete require.cache[file];
		});

		// TODO: If path is wrong, leave it to higher powers until we publish on npm
		// Could also install and load and install through github
		return require(path.join(dirPath, 'webpack.js'))
	});
	*/
}
var yargs = require('yargs');

yargs
	.usage(`webpack-cli ${require('../package.json').version}

Usage: $0 <cmd> [args]

Usage without config file: webpack <entry> [<entry>] <output>
Usage with config file: webpack

More: https://webpack.github.io/docs/cli.html
`)
	.help()
	.alias('help', 'h', '?')
	.version()
	.alias('version', 'v')
	.commandDir(path.join(__dirname, '..', 'commands'))
	.wrap(yargs.terminalWidth())
	.strict()
	.argv;
