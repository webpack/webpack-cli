const HELP_GROUP = 'Help options:';
const CONFIG_GROUP = 'Config options:';
const BASIC_GROUP = 'Basic options:';
const OUTPUT_GROUP = 'Output options:';
const ADVANCED_GROUP = 'Advanced options:';
const DISPLAY_GROUP = 'Stats options:';

module.exports = {
    commands: [
        {
            name: 'create',
            alias: 'c',
            type: String,
            usage: 'create | create <scaffold>',
            description: 'Initialize a new webpack configuration',
        },
        {
            name: 'migrate',
            alias: 'm',
            type: String,
            usage: 'migrate',
            description: 'Migrate a configuration to a new version',
        },
        {
            name: 'loader',
            scope: 'external',
            alias: 'l',
            type: String,
            usage: 'loader',
            description: 'Scaffold a loader repository',
        },
        {
            name: 'plugin',
            alias: 'p',
            scope: 'external',
            type: String,
            usage: 'plugin',
            description: 'Scaffold a plugin repository',
        },
        {
            name: 'info',
            scope: 'external',
            type: String,
            usage: 'info [options] [output-format]',
            description: 'Outputs information about your system and dependencies',
            flags: [
                {
                    name: 'output-json',
                    type: Boolean,
                    group: OUTPUT_GROUP,
                    description: 'To get the output as JSON',
                },
                {
                    name: 'output-markdown',
                    type: Boolean,
                    group: OUTPUT_GROUP,
                    description: 'To get the output as markdown',
                },
                {
                    name: 'help',
                    type: Boolean,
                    group: BASIC_GROUP,
                    description: 'Shows help',
                },
                {
                    name: 'version',
                    type: Boolean,
                    group: BASIC_GROUP,
                    description: 'Show version number of webpack-cli',
                },
                {
                    name: 'system',
                    alias: 's',
                    type: Boolean,
                    group: BASIC_GROUP,
                    description: 'System information ( OS, CPU )',
                },
                {
                    name: 'binaries',
                    alias: 'b',
                    type: Boolean,
                    group: BASIC_GROUP,
                    description: 'Installed binaries (Node, yarn, npm)',
                },
                {
                    name: 'browsers',
                    type: Boolean,
                    group: BASIC_GROUP,
                    description: 'Installed web browsers',
                },
                {
                    name: 'npmg',
                    type: Boolean,
                    group: BASIC_GROUP,
                    description: 'Globally installed NPM packages ( webpack & webpack-cli only )',
                },
                {
                    name: 'npmPackages',
                    type: Boolean,
                    group: BASIC_GROUP,
                    description: 'Info about packages related to webpack installed in the project',
                },
            ],
        },
        {
            name: 'serve',
            scope: 'external',
            type: String,
            usage: 'serve',
            description: 'Run the webpack Dev Server',
        },
    ],
    core: [
        {
            name: 'entry',
            type: String,
            defaultValue: null,
            defaultOption: true,
            group: BASIC_GROUP,
            description: 'The entry point of your application',
        },
        {
            name: 'config',
            alias: 'c',
            type: String,
            defaultValue: null,
            group: CONFIG_GROUP,
            description: 'Provide path to a webpack configuration file',
        },
        {
            name: 'merge',
            alias: 'm',
            type: String,
            group: CONFIG_GROUP,
            description: 'Merge a configuration file',
        },
        {
            name: 'progress',
            type: Boolean,
            group: BASIC_GROUP,
            description: 'Print compilation progress during build',
        },
        {
            name: 'silent',
            type: Boolean,
            group: DISPLAY_GROUP,
            description: 'Disable any output that webpack makes',
        },
        {
            name: 'help',
            type: Boolean,
            group: HELP_GROUP,
            description: 'Outputs list of supported flags',
        },
        {
            name: 'defaults',
            type: Boolean,
            group: BASIC_GROUP,
            description: 'Allow webpack to set defaults aggresively',
        },
        {
            name: 'output',
            alias: 'o',
            group: OUTPUT_GROUP,
            type: String,
            description: 'Output location of the file generated by webpack',
        },
        {
            name: 'plugin',
            group: ADVANCED_GROUP,
            type: String,
            description: 'Load a given plugin',
        },
        {
            name: 'global',
            alias: 'g',
            type: String,
            multiple: true,
            group: ADVANCED_GROUP,
            description: 'Declares and exposes a global variable',
        },
        {
            name: 'target',
            alias: 't',
            defaultValue: 'web',
            type: String,
            group: ADVANCED_GROUP,
            description: 'Sets the build target',
        },
        {
            name: 'watch',
            type: Boolean,
            alias: 'w',
            group: BASIC_GROUP,
            description: 'Watch for files changes',
        },
        {
            name: 'hot',
            alias: 'h',
            type: Boolean,
            group: ADVANCED_GROUP,
            description: 'Enables Hot Module Replacement',
        },
        {
            name: 'sourcemap',
            type: String,
            alias: 's',
            defaultValue: undefined,
            group: BASIC_GROUP,
            description: 'Determine source maps to use',
        },
        {
            name: 'prefetch',
            type: String,
            group: ADVANCED_GROUP,
            description: 'Prefetch this request',
        },
        {
            name: 'json',
            type: Boolean,
            alias: 'j',
            description: 'Prints result as JSON',
            group: DISPLAY_GROUP,
        },
        {
            name: 'dev',
            alias: 'd',
            type: Boolean,
            defaultValue: undefined,
            group: BASIC_GROUP,
            description: 'Run development build',
        },
        {
            name: 'prod',
            alias: 'p',
            type: Boolean,
            defaultValue: undefined,
            group: BASIC_GROUP,
            description: 'Run production build',
        },
        {
            name: 'version',
            type: Boolean,
            group: BASIC_GROUP,
            description: 'Get current version',
        },
        /* 		{
			name: "analyze",
			type: Boolean,
			group: BASIC_GROUP,
			description: "analyze build for performance improvements"
		}, */
        /* 		{
			name: "interactive",
			type: Boolean,
			alias: "i",
			description: "Use webpack interactively",
			group: BASIC_GROUP
		} */
    ],
};
