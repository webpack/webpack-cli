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
var yargs = require('yargs')
	.usage('webpack-cli ' + require('../package.json').version + '\n' +
		'Usage: https://webpack.github.io/docs/cli.html\n' +
		'Usage without config file: webpack <entry> [<entry>] <output>\n' +
		'Usage with config file: webpack');

require('./config-yargs')(yargs);


var DISPLAY_GROUP = 'Stats options:';
var BASIC_GROUP = 'Basic options:';

yargs.options({
	'json': {
		type: 'boolean',
		alias: 'j',
		describe: 'Prints the result as JSON.'
	},
	'progress': {
		type: 'boolean',
		describe: 'Print compilation progress in percentage',
		group: BASIC_GROUP
	},
	'color': {
		type: 'boolean',
		alias: 'colors',
		default: function supportsColor() {
			return require('supports-color');
		},
		group: DISPLAY_GROUP,
		describe: 'Enables/Disables colors on the console'
	},
	'sort-modules-by': {
		type: 'string',
		group: DISPLAY_GROUP,
		describe: 'Sorts the modules list by property in module'
	},
	'sort-chunks-by': {
		type: 'string',
		group: DISPLAY_GROUP,
		describe: 'Sorts the chunks list by property in chunk'
	},
	'sort-assets-by': {
		type: 'string',
		group: DISPLAY_GROUP,
		describe: 'Sorts the assets list by property in asset'
	},
	'hide-modules': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Hides info about modules'
	},
	'display-exclude': {
		type: 'string',
		group: DISPLAY_GROUP,
		describe: 'Exclude modules in the output'
	},
	'display-modules': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display even excluded modules in the output'
	},
	'display-chunks': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display chunks in the output'
	},
	'display-entrypoints': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display entry points in the output'
	},
	'display-origins': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display origins of chunks in the output'
	},
	'display-cached': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display also cached modules in the output'
	},
	'display-cached-assets': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display also cached assets in the output'
	},
	'display-reasons': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display reasons about module inclusion in the output'
	},
	'display-used-exports': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display information about used exports in modules (Tree Shaking)'
	},
	'display-provided-exports': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display information about exports provided from modules'
	},
	'display-error-details': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Display details about errors'
	},
	'verbose': {
		type: 'boolean',
		group: DISPLAY_GROUP,
		describe: 'Show more details'
	}
});

var argv = yargs.argv;

if(argv.verbose) {
	argv['display-reasons'] = true;
	argv['display-entrypoints'] = true;
	argv['display-used-exports'] = true;
	argv['display-provided-exports'] = true;
	argv['display-error-details'] = true;
	argv['display-modules'] = true;
	argv['display-cached'] = true;
	argv['display-cached-assets'] = true;
}

var processOptions = require('./process-options');
var initInquirer = require('../lib/initialize');

if(argv.init) {
	initInquirer(argv._);
} else if(argv.migrate) {
	const filePaths = argv._;
	if (!filePaths.length) {
		throw new Error('Please specify a path to your webpack config');
	}
	const inputConfigPath = path.resolve(process.cwd(), filePaths[0]);

	require('../lib/migrate.js')(inputConfigPath, inputConfigPath);
} else {
	processOptions(yargs,argv);
}
