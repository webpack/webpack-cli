const HELP_GROUP = "Help options:";
const CONFIG_GROUP = "Config options:";
const BASIC_GROUP = "Basic options:";
const MODULE_GROUP = "Module options:";
const OUTPUT_GROUP = "Output options:";
const ADVANCED_GROUP = "Advanced options:";
const RESOLVE_GROUP = "Resolve options:";
const OPTIMIZE_GROUP = "Optimize options:";

module.exports = [
	{
		name: "config",
		type: String,
		group: CONFIG_GROUP,
		defaultDescription: "webpack.config.js or webpackfile.js"
	},
	{
		name: "config-register",
		type: String,
		multiple: true,
		alias: "r",
		group: CONFIG_GROUP,
		defaultDescription: "module id or path"
	},
	{
		name: "config-name",
		type: String,
		group: CONFIG_GROUP
	},
	{
		name: "env",
		type: String,
		group: CONFIG_GROUP
	},
	{
		name: "mode",
		type: Array,
		choices: [],
		group: CONFIG_GROUP
	},
	{
		name: "context",
		type: String,
		group: BASIC_GROUP
	},
	{
		name: "entry",
		type: String,
		multiple: true,
		group: BASIC_GROUP
	},
	{
		name: "help",
		type: Boolean,
		group: HELP_GROUP
	},
	{
		name: "module-bind",
		type: String,
		group: MODULE_GROUP
	},
	{
		name: "module-bind-post",
		type: String,
		group: MODULE_GROUP
	},
	{
		name: "module-bind-pre",
		type: String,
		group: MODULE_GROUP
	},
	{
		name: "output",
		type: String,
		alias: "o",
		group: OUTPUT_GROUP
	},
	{
		name: "output-path",
		type: String,
		group: OUTPUT_GROUP
	},
	{
		name: "output-filename",

		type: String,
		group: OUTPUT_GROUP
	},
	{
		name: "output-chunk-filename",
		type: String,
		group: OUTPUT_GROUP
	},
	{
		name: "output-source-map-filename",
		type: String,
		group: OUTPUT_GROUP
	},
	{
		name: "output-public-path",
		type: String,
		group: OUTPUT_GROUP
	},
	{
		name: "output-jsonp-function",
		type: String,
		group: OUTPUT_GROUP
	},
	{
		name: "output-pathinfo",
		type: Boolean,
		group: OUTPUT_GROUP
	},
	{
		name: "output-library",
		type: String,
		group: OUTPUT_GROUP
	},
	{
		name: "output-library-target",
		type: String,
		group: OUTPUT_GROUP
	},
	{
		name: "records-input-path",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "records-output-path",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "records-path",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "define",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "target",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "cache",
		type: Boolean,
		group: ADVANCED_GROUP
	},
	{
		name: "watch",
		type: Boolean,
		alias: "w",
		group: BASIC_GROUP
	},
	{
		name: "watch-stdin",
		type: Boolean,
		alias: "s",
		group: ADVANCED_GROUP
	},
	{
		name: "watch-aggregate-timeout",
		type: Array,
		group: ADVANCED_GROUP
	},
	{
		name: "watch-poll",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "hot",
		type: Boolean,
		group: ADVANCED_GROUP
	},
	{
		name: "debug",
		type: Boolean,
		group: BASIC_GROUP
	},
	{
		name: "devtool",
		type: String,
		group: BASIC_GROUP
	},
	{
		name: "resolve-alias",
		type: String,
		group: RESOLVE_GROUP
	},
	{
		name: "resolve-extensions",
		type: Array,
		group: RESOLVE_GROUP
	},
	{
		name: "resolve-loader-alias",
		type: String,
		group: RESOLVE_GROUP
	},
	{
		name: "optimize-max-chunks",
		type: String,
		group: OPTIMIZE_GROUP
	},
	{
		name: "optimize-min-chunk-size",
		type: String,
		group: OPTIMIZE_GROUP
	},
	{
		name: "optimize-minimize",
		type: Boolean,
		group: OPTIMIZE_GROUP
	},
	{
		name: "prefetch",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "provide",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "labeled-modules",
		type: Boolean,
		group: ADVANCED_GROUP
	},
	{
		name: "plugin",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "bail",
		type: String,
		group: ADVANCED_GROUP
	},
	{
		name: "profile",
		type: Boolean,
		group: ADVANCED_GROUP
	},
	{
		name: "d",
		type: Boolean,
		group: BASIC_GROUP
	},
	{
		name: "p",
		type: Boolean,
		group: BASIC_GROUP
	},
	{
		name: "h",
		type: Boolean,
		group: HELP_GROUP
	}
];
