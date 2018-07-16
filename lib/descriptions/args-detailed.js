const optionsSchema = require("./schema.js");

const HELP_GROUP = "Help options:";
const CONFIG_GROUP = "Config options:";
const BASIC_GROUP = "Basic options:";
const MODULE_GROUP = "Module options:";
const OUTPUT_GROUP = "Output options:";
const ADVANCED_GROUP = "Advanced options:";
const RESOLVE_GROUP = "Resolve options:";
const OPTIMIZE_GROUP = "Optimize options:";

module.exports = {
			config: {
				type: "string",
				group: CONFIG_GROUP,
				defaultDescription: "webpack.config.js or webpackfile.js",
				
			},
			"config-register": {
				type: "array",
				alias: "r",
				group: CONFIG_GROUP,
				defaultDescription: "module id or path",
				
			},
			"config-name": {
				type: "string",
				group: CONFIG_GROUP,
				
			},
			env: {
				group: CONFIG_GROUP
			},
			mode: {
				type: "Array",
				choices: optionsSchema.mode,
				group: CONFIG_GROUP,
				
			},
			context: {
				type: optionsSchema.context,
				group: BASIC_GROUP,
				
			},
			entry: {
				type: "string",
				group: BASIC_GROUP,
				
			},
			help: {
				type: 'String',
				group: HELP_GROUP
			},
			"module-bind": {
				type: "string",
				group: MODULE_GROUP,
				
			},
			"module-bind-post": {
				type: "string",
				group: MODULE_GROUP,
				
			},
			"module-bind-pre": {
				type: "string",
				group: MODULE_GROUP,
				
			},
			output: {
				alias: "o",
				group: OUTPUT_GROUP,
				
			},
			"output-path": {
				type: "string",
				group: OUTPUT_GROUP,
				
			},
			"output-filename": {
				type: "string",
				group: OUTPUT_GROUP
				
			},
			"output-chunk-filename": {
				type: "string",
				group: OUTPUT_GROUP,
				
			},
			"output-source-map-filename": {
				type: "string",
				group: OUTPUT_GROUP,
				
			},
			"output-public-path": {
				type: "string",
				group: OUTPUT_GROUP,
				
			},
			"output-jsonp-function": {
				type: "string",
				group: OUTPUT_GROUP,
				
			},
			"output-pathinfo": {
				type: "boolean",
				group: OUTPUT_GROUP
			},
			"output-library": {
				type: "string",
				group: OUTPUT_GROUP,
				
			},
			"output-library-target": {
				type: "string",
				choices: [],
				group: OUTPUT_GROUP,
				
			},
			"records-input-path": {
				type: "string",
				group: ADVANCED_GROUP,
				
			},
			"records-output-path": {
				type: "string",
				group: ADVANCED_GROUP,
				
			},
			"records-path": {
				type: "string",
				group: ADVANCED_GROUP,
				
			},
			define: {
				type: "string",
				group: ADVANCED_GROUP,
				
			},
			target: {
				type: "string",
				group: ADVANCED_GROUP,
				
			},
			cache: {
				type: "boolean",
				group: ADVANCED_GROUP,
			},
			watch: {
				type: "boolean",
				alias: "w",
				group: BASIC_GROUP
			},
			"watch-stdin": {
				type: "boolean",
				alias: "stdin",
				group: ADVANCED_GROUP
			},
			"watch-aggregate-timeout": {
				type:
					optionsSchema.watchOptions.properties.aggregateTimeout
						.type,
				group: ADVANCED_GROUP,
				
			},
			"watch-poll": {
				type: "string",
				group: ADVANCED_GROUP
			},
			hot: {
				type: "boolean",
				group: ADVANCED_GROUP
			},
			debug: {
				type: "boolean",
				group: BASIC_GROUP
			},
			devtool: {
				type: "string",
				group: BASIC_GROUP,
				
			},
			"resolve-alias": {
				type: "string",
				group: RESOLVE_GROUP,
				
			},
			"resolve-extensions": {
				type: "array",
				group: RESOLVE_GROUP,
				
			},
			"resolve-loader-alias": {
				type: "string",
				group: RESOLVE_GROUP,
				
			},
			"optimize-max-chunks": {
				group: OPTIMIZE_GROUP,
				
			},
			"optimize-min-chunk-size": {
				group: OPTIMIZE_GROUP,
				
			},
			"optimize-minimize": {
				type: "boolean",
				group: OPTIMIZE_GROUP
			},
			prefetch: {
				type: "string",
				group: ADVANCED_GROUP,
				
			},
			provide: {
				type: "string",
				group: ADVANCED_GROUP,
				
			},
			"labeled-modules": {
				type: "boolean",
				group: ADVANCED_GROUP
			},
			plugin: {
				type: "string",
				group: ADVANCED_GROUP,
				
			},
			bail: {
				type: optionsSchema.bail.type,
				group: ADVANCED_GROUP,
			},
			profile: {
				type: "boolean",
				group: ADVANCED_GROUP,
				default: null
			},
			d: {
				type: "boolean",
				group: BASIC_GROUP
			},
			p: {
				type: "boolean",
				group: BASIC_GROUP
			},
			h: {
				type: 'boolean',
				group: HELP_GROUP
			}
		};
