const optionsSchema = require("./schema.json");

const HELP_GROUP = "Help options:";
const CONFIG_GROUP = "Config options:";
const BASIC_GROUP = "Basic options:";
const MODULE_GROUP = "Module options:";
const OUTPUT_GROUP = "Output options:";
const ADVANCED_GROUP = "Advanced options:";
const RESOLVE_GROUP = "Resolving options:";
const OPTIMIZE_GROUP = "Optimizing options:";

module.exports = {
			config: {
				type: "string",
				describe: "Path to the config file",
				group: CONFIG_GROUP,
				defaultDescription: "webpack.config.js or webpackfile.js",
				
			},
			"config-register": {
				type: "array",
				alias: "r",
				describe:
					"Preload one or more modules before loading the webpack configuration",
				group: CONFIG_GROUP,
				defaultDescription: "module id or path",
				
			},
			"config-name": {
				type: "string",
				describe: "Name of the config to use",
				group: CONFIG_GROUP,
				
			},
			env: {
				describe: "Environment passed to the config, when it is a function",
				group: CONFIG_GROUP
			},
			mode: {
				type: optionsSchema.properties.mode.type,
				choices: optionsSchema.properties.mode.enum,
				describe: optionsSchema.properties.mode.description,
				group: CONFIG_GROUP,
				
			},
			context: {
				type: optionsSchema.properties.context.type,
				describe: optionsSchema.properties.context.description,
				group: BASIC_GROUP,
				defaultDescription: "The current directory",
				
			},
			entry: {
				type: "string",
				describe: optionsSchema.properties.entry.description,
				group: BASIC_GROUP,
				
			},
			help: {
				type: 'String',
				describe: 'outputs options available',
				group: HELP_GROUP
			},
			"module-bind": {
				type: "string",
				describe: "Bind an extension to a loader",
				group: MODULE_GROUP,
				
			},
			"module-bind-post": {
				type: "string",
				describe: "Bind an extension to a post loader",
				group: MODULE_GROUP,
				
			},
			"module-bind-pre": {
				type: "string",
				describe: "Bind an extension to a pre loader",
				group: MODULE_GROUP,
				
			},
			output: {
				alias: "o",
				describe: "The output path and file for compilation assets",
				group: OUTPUT_GROUP,
				
			},
			"output-path": {
				type: "string",
				describe: optionsSchema.definitions.output.properties.path.description,
				group: OUTPUT_GROUP,
				defaultDescription: "The current directory",
				
			},
			"output-filename": {
				type: "string",
				describe:
					optionsSchema.definitions.output.properties.filename.description,
				group: OUTPUT_GROUP,
				defaultDescription: "[name].js",
				
			},
			"output-chunk-filename": {
				type: "string",
				describe:
					optionsSchema.definitions.output.properties.chunkFilename.description,
				group: OUTPUT_GROUP,
				defaultDescription:
					"filename with [id] instead of [name] or [id] prefixed",
				
			},
			"output-source-map-filename": {
				type: "string",
				describe:
					optionsSchema.definitions.output.properties.sourceMapFilename
						.description,
				group: OUTPUT_GROUP,
				
			},
			"output-public-path": {
				type: "string",
				describe:
					optionsSchema.definitions.output.properties.publicPath.description,
				group: OUTPUT_GROUP,
				
			},
			"output-jsonp-function": {
				type: "string",
				describe:
					optionsSchema.definitions.output.properties.jsonpFunction.description,
				group: OUTPUT_GROUP,
				
			},
			"output-pathinfo": {
				type: "boolean",
				describe:
					optionsSchema.definitions.output.properties.pathinfo.description,
				group: OUTPUT_GROUP
			},
			"output-library": {
				type: "string",
				describe: "Expose the exports of the entry point as library",
				group: OUTPUT_GROUP,
				
			},
			"output-library-target": {
				type: "string",
				describe:
					optionsSchema.definitions.output.properties.libraryTarget.description,
				choices: optionsSchema.definitions.output.properties.libraryTarget.enum,
				group: OUTPUT_GROUP,
				
			},
			"records-input-path": {
				type: "string",
				describe: optionsSchema.properties.recordsInputPath.description,
				group: ADVANCED_GROUP,
				
			},
			"records-output-path": {
				type: "string",
				describe: optionsSchema.properties.recordsOutputPath.description,
				group: ADVANCED_GROUP,
				
			},
			"records-path": {
				type: "string",
				describe: optionsSchema.properties.recordsPath.description,
				group: ADVANCED_GROUP,
				
			},
			define: {
				type: "string",
				describe: "Define any free var in the bundle",
				group: ADVANCED_GROUP,
				
			},
			target: {
				type: "string",
				describe: optionsSchema.properties.target.description,
				group: ADVANCED_GROUP,
				
			},
			cache: {
				type: "boolean",
				describe: optionsSchema.properties.cache.description,
				default: null,
				group: ADVANCED_GROUP,
				defaultDescription: "It's enabled by default when watching"
			},
			watch: {
				type: "boolean",
				alias: "w",
				describe: optionsSchema.properties.watch.description,
				group: BASIC_GROUP
			},
			"watch-stdin": {
				type: "boolean",
				alias: "stdin",
				describe:
					optionsSchema.properties.watchOptions.properties.stdin.description,
				group: ADVANCED_GROUP
			},
			"watch-aggregate-timeout": {
				describe:
					optionsSchema.properties.watchOptions.properties.aggregateTimeout
						.description,
				type:
					optionsSchema.properties.watchOptions.properties.aggregateTimeout
						.type,
				group: ADVANCED_GROUP,
				
			},
			"watch-poll": {
				type: "string",
				describe:
					optionsSchema.properties.watchOptions.properties.poll.description,
				group: ADVANCED_GROUP
			},
			hot: {
				type: "boolean",
				describe: "Enables Hot Module Replacement",
				group: ADVANCED_GROUP
			},
			debug: {
				type: "boolean",
				describe: "Switch loaders to debug mode",
				group: BASIC_GROUP
			},
			devtool: {
				type: "string",
				describe: optionsSchema.properties.devtool.description,
				group: BASIC_GROUP,
				
			},
			"resolve-alias": {
				type: "string",
				describe:
					optionsSchema.definitions.resolve.properties.alias.description,
				group: RESOLVE_GROUP,
				
			},
			"resolve-extensions": {
				type: "array",
				describe:
					optionsSchema.definitions.resolve.properties.alias.description,
				group: RESOLVE_GROUP,
				
			},
			"resolve-loader-alias": {
				type: "string",
				describe: "Setup a loader alias for resolving",
				group: RESOLVE_GROUP,
				
			},
			"optimize-max-chunks": {
				describe: "Try to keep the chunk count below a limit",
				group: OPTIMIZE_GROUP,
				
			},
			"optimize-min-chunk-size": {
				describe:
					optionsSchema.properties.optimization.properties.splitChunks.oneOf[1]
						.properties.minSize.description,
				group: OPTIMIZE_GROUP,
				
			},
			"optimize-minimize": {
				type: "boolean",
				describe:
					optionsSchema.properties.optimization.properties.minimize.description,
				group: OPTIMIZE_GROUP
			},
			prefetch: {
				type: "string",
				describe: "Prefetch this request (Example: --prefetch ./file.js)",
				group: ADVANCED_GROUP,
				
			},
			provide: {
				type: "string",
				describe:
					"Provide these modules as free vars in all modules (Example: --provide jQuery=jquery)",
				group: ADVANCED_GROUP,
				
			},
			"labeled-modules": {
				type: "boolean",
				describe: "Enables labeled modules",
				group: ADVANCED_GROUP
			},
			plugin: {
				type: "string",
				describe: "Load this plugin",
				group: ADVANCED_GROUP,
				
			},
			bail: {
				type: optionsSchema.properties.bail.type,
				describe: optionsSchema.properties.bail.description,
				group: ADVANCED_GROUP,
				default: null
			},
			profile: {
				type: "boolean",
				describe: optionsSchema.properties.profile.description,
				group: ADVANCED_GROUP,
				default: null
			},
			d: {
				type: "boolean",
				describe:
					"shortcut for --debug --devtool eval-cheap-module-source-map --output-pathinfo",
				group: BASIC_GROUP
			},
			p: {
				type: "boolean",
				describe:
					"shortcut for --optimize-minimize --define process.env.NODE_ENV=\"production\"",
				group: BASIC_GROUP
			},
			h: {
				type: 'boolean',
				describe: 'Shortcut for --help',
				group: HELP_GROUP
			}
		};
