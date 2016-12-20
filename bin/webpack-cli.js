#!/usr/bin/env node

var path = require('path');
var processOptions = require('./processOptions');
// Local version replace global one
try {
	var localWebpack = require.resolve(path.join(process.cwd(), 'node_modules', 'webpack-cli', 'bin', 'webpack-cli.js'));
	if(__filename !== localWebpack) {
		return require(localWebpack);
	}
} catch(e) {}


var yargs = require('yargs')
	.usage('\n' + 'webpack-cli ' + require('../package.json').version + '\n' + '\n' +
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

argv.init ? require('../lib/inquirer.js') : processOptions(yargs, argv);
