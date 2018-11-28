const Validator = require("../utils/file-path-validation");

const ArgsValidator = new Validator();

const HELP_GROUP = "Help options:";
const CONFIG_GROUP = "Config options:";
const BASIC_GROUP = "Basic options:";
const MODULE_GROUP = "Module options:";
const OUTPUT_GROUP = "Output options:";
const ADVANCED_GROUP = "Advanced options:";
const RESOLVE_GROUP = "Resolve options:";
const OPTIMIZE_GROUP = "Optimize options:";
const DISPLAY_GROUP = "Stats options:";

module.exports = {
	commands: [
		{
			name: "init",
			alias: "i",
			scope: "external",
			type: String,
			description: "Initialize a new webpack configuration"
		},
		{
			name: "migrate",
			scope: "external",
			type: String,
			description: "Migrate a configuration to a new version"
		},
		{
			name: "add",
			scope: "external",
			alias: "a",
			type: String,
			description: "Add a property to your configuration"
		},
		{
			name: "remove",
			scope: "external",
			alias: "r",
			type: String,
			description: "Remove a property from your configuration"
		},
		{
			name: "update",
			alias: "u",
			scope: "external",
			type: String,
			description: "Update a property in your webpack configuration"
		},
		{
			name: "make",
			alias: "m",
			scope: "internal",
			type: String,
			description: "Makefile build for your webpack configuration"
		},
		{
			name: "serve",
			type: String,
			description: "Use webpack-serve to bundle"
		},
		{
			name: "generate-loader",
			scope: "external",
			type: String,
			description: "Scaffold a loader repository"
		},
		{
			name: "generate-plugin",
			scope: "external",
			type: String,
			description: "Scaffold a plugin repository"
		},
		{
			name: "info",
			scope: "external",
			type: String,
			description: "Outputs information about your system and dependencies"
		},
		{
			name: "interactive",
			scope: "internal",
			type: String,
			alias: "w",
			description: "Use webpack interactively"
		}
	],
	core: [
		{
			name: "entry",
			type: file => ArgsValidator.resolveFilePath(file, "index"),
			defaultValue: ArgsValidator.resolveFilePath(null, "index"),
			multiple: true,
			defaultOption: true,
			group: BASIC_GROUP,
			description: "The entry point of your application [ex: ./index.js]"
		},
		{
			name: "config",
			alias: "c",
			type: file => ArgsValidator.resolveFilePath(file, "webpack.config"),
			group: CONFIG_GROUP,
			description: "Path to the config file [ex: webpack.config.js]"
		},
		{
			name: "config-register",
			type: String,
			multiple: true,
			alias: "r",
			group: CONFIG_GROUP,
			description:
				"Preload one or more modules before loading the webpack configuration"
		},
		{
			name: "config-name",
			type: String,
			group: CONFIG_GROUP,
			description: "Name of the config file"
		},
		{
			name: "extend",
			alias: "e",
			type: String,
			group: CONFIG_GROUP,
			description: "Merge a configuration file"
		},

		{
			name: "progress",
			type: Boolean,
			description: "Print compilation progress in percentage",
			group: BASIC_GROUP
		},

		{
			name: "colors",
			type: Boolean,
			defaultValue: true,
			group: DISPLAY_GROUP,
			description: "Enables/Disables colors on the console"
		},
		{
			name: "sort-modules-by",
			type: String,
			group: DISPLAY_GROUP,
			description: "Sorts the modules list by property in module"
		},
		{
			name: "sort-chunks-by",
			type: String,
			group: DISPLAY_GROUP,
			description: "Sorts the chunks list by property in chunk"
		},
		{
			name: "sort-assets-by",
			type: String,
			group: DISPLAY_GROUP,
			description: "Sorts the assets list by property in asset"
		},

		{
			name: "hide-modules",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Hides info about modules"
		},
		{
			name: "display-exclude",
			type: String,
			group: DISPLAY_GROUP,
			description: "Exclude modules in the output"
		},
		{
			name: "display-modules",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display even excluded modules in the output"
		},
		{
			name: "display-max-modules",
			type: Number,
			group: DISPLAY_GROUP,
			description: "Sets the maximum number of visible modules in output"
		},
		{
			name: "display-chunks",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display chunks in the output"
		},
		{
			name: "display-entrypoints",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display entry points in the output"
		},
		{
			name: "display-origins",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display origins of chunks in the output"
		},
		{
			name: "display-cached",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display also cached modules in the output"
		},
		{
			name: "display-cached-assets",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display also cached assets in the output"
		},
		{
			name: "display-reasons",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display reasons about module inclusion in the output"
		},
		{
			name: "display-depth",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display distance from entry point for each module"
		},
		{
			name: "display-used-exports",
			type: Boolean,
			group: DISPLAY_GROUP,
			description:
				"Display information about used exports in modules (Tree Shaking)"
		},
		{
			name: "display-provided-exports",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display information about exports provided from modules"
		},
		{
			name: "display-optimization-bailout",
			type: Boolean,
			group: DISPLAY_GROUP,
			description:
				"Display information about why optimization bailed out for modules"
		},
		{
			name: "display-error-details",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Display details about errors"
		},
		{
			name: "display",
			type: String,
			choices: [
				"",
				"verbose",
				"detailed",
				"normal",
				"minimal",
				"errors-only",
				"none"
			],
			group: DISPLAY_GROUP,
			description: "Select display preset"
		},
		{
			name: "verbose",
			type: Boolean,
			group: DISPLAY_GROUP,
			description: "Show more details"
		},
		{
			name: "info-verbosity",
			type: String,
			defaultValue: "info",
			choices: ["none", "info", "verbose"],
			group: DISPLAY_GROUP,
			description:
				"Controls the output of lifecycle messaging e.g. Started watching files..."
		},
		{
			name: "build-delimiter",
			type: String,
			group: DISPLAY_GROUP,
			description: "Display custom text after build output"
		},
		{
			name: "env",
			type: string =>
				ArgsValidator.setArrayVal(string, ["prod", "dev"], "prod"),
			defaultValue: "prod",
			group: CONFIG_GROUP,
			description: "Environment passed to the config"
		},
		{
			name: "mode",
			type: string =>
				ArgsValidator.setArrayVal(
					string,
					["production", "development", "none"],
					"production"
				),
			group: CONFIG_GROUP,
			defaultValue: "production",
			description: "Sets production, development or none mode to your build"
		},
		{
			name: "context",
			type: fp => ArgsValidator.resolveFileDirectory(fp, "./"),
			group: BASIC_GROUP,
			description: "Determines where webpack will look for files"
		},

		{
			name: "help",
			alias: "h",
			type: Boolean,
			group: HELP_GROUP,
			description: "Outputs the list of arguments"
		},
		{
			name: "module-bind",
			type: String,
			group: MODULE_GROUP,
			description: "Bind an extension to a loader"
		},
		{
			name: "module-bind-post",
			type: String,
			group: MODULE_GROUP,
			description: "Bind an extension to a post loader"
		},
		{
			name: "module-bind-pre",
			type: String,
			group: MODULE_GROUP,
			description: "Bind an extension to a pre loader"
		},
		{
			name: "output",
			alias: "o",
			type: file => ArgsValidator.resolveFileDirectory(file, "dist"),
			defaultValue: ArgsValidator.resolveFileDirectory(null, "dist"),
			group: OUTPUT_GROUP,
			description: "The output path and file for compilation assets"
		},
		{
			name: "output-path",
			group: OUTPUT_GROUP,
			type: file => ArgsValidator.resolveFileDirectory(file, "dist"),
			description: "The path where webpack will output its generated files"
		},
		{
			name: "output-chunk-load-timeout",
			type: Number,
			group: OUTPUT_GROUP,
			description: "Number of milliseconds before chunk request expires"
		},
		{
			name: "output-cross-origin-loading",
			type: String,
			group: OUTPUT_GROUP,
			description: "Configure cross origin loading when target is web"
		},
		{
			name: "output-jsonp-type",
			type: string => ArgsValidator.setString(string, "text/javascript"),
			group: OUTPUT_GROUP,
			description:
				"Modify the script type webpack injects into the DOM to download async chunks."
		},
		{
			name: "output-devtool-fallback-module-filename-template",
			type: String,
			group: OUTPUT_GROUP,
			description:
				"Specify fallback when the template string/function yields duplicates"
		},
		{
			name: "output-filename",
			group: OUTPUT_GROUP,
			type: string => ArgsValidator.setString(string, "bundle.js"),
			description: "Name of the file generated by webpack"
		},
		{
			name: "output-devtool-module-filename-template",
			type: String,
			group: OUTPUT_GROUP,
			description: "Customize names used in source map's sources array."
		},
		{
			name: "output-devtool-namespace",
			type: String,
			group: OUTPUT_GROUP,
			description:
				"Determines the modules namespace used with --output-devtool-module-filename-template"
		},
		{
			name: "output-chunk-filename",
			group: OUTPUT_GROUP,
			type: string => ArgsValidator.setString(string, "[id].js"),
			description: "Give each file a specific [id] or [hash] prefix"
		},
		{
			name: "output-hash-digest",
			type: string => ArgsValidator.setString(string, "hex"),
			group: OUTPUT_GROUP,
			description: "Specify encoding to use when generating output hash."
		},
		{
			name: "output-hash-digest-length",
			group: OUTPUT_GROUP,
			type: num => ArgsValidator.setNumber(num, 20),
			description: "Specify prefix length of hash digest"
		},
		{
			name: "output-source-map-filename",
			type: string => ArgsValidator.setString(string, "[file].map"),
			group: OUTPUT_GROUP,
			description: "The name of the sourcemap generated by webpack"
		},
		{
			name: "output-public-path",
			type: string => ArgsValidator.setString(string, ""),
			group: OUTPUT_GROUP,
			description: "The public path webpack will index files from"
		},
		{
			name: "output-jsonp-function",
			type: String,
			group: OUTPUT_GROUP,
			description: "A function used to async load chunks in a web target"
		},
		{
			name: "output-pathinfo",
			type: Boolean,
			group: OUTPUT_GROUP,
			description: "Include comments in generated files about the modules"
		},
		{
			name: "output-library",
			type: String,
			group: OUTPUT_GROUP,
			description: "Expose the exports of the entry point as library"
		},
		{
			name: "output-library-target",
			type: String,
			group: OUTPUT_GROUP,
			description: "Descripes the target of the library [ex: CJS/umd]"
		},
		{
			name: "records-input-path",
			type: String,
			group: ADVANCED_GROUP,
			description: "Specifies a input path for records of module information."
		},
		{
			name: "records-output-path",
			type: String,
			group: ADVANCED_GROUP,
			description: "Specifies an output path for records of module information."
		},
		{
			name: "records-path",
			type: String,
			group: ADVANCED_GROUP,
			description: "Specifies a path for records of module information."
		},
		{
			name: "define",
			type: String,
			group: ADVANCED_GROUP,
			description: "Define any free variable in the bundle"
		},
		{
			name: "target",
			type: String,
			group: ADVANCED_GROUP,
			description: "Sets the target to built against [ex: web]"
		},
		{
			name: "cache",
			type: Boolean,
			group: ADVANCED_GROUP,
			description: "Cache modules to improve compilation speed."
		},
		{
			name: "watch",
			type: Boolean,
			alias: "w",
			group: BASIC_GROUP,
			description: "Watch for files changes."
		},

		{
			name: "watch-aggregate-timeout.",
			type: num => ArgsValidator.setNumber(num, 300),
			group: ADVANCED_GROUP,
			description: "Specify a timeout before webpack rebuilds."
		},
		{
			name: "watch-poll",
			type: num => ArgsValidator.setNumber(num, 10e3),
			group: ADVANCED_GROUP,
			description: "Specify an intervall webpack will watch for file changes."
		},
		{
			name: "hot",
			type: Boolean,
			group: ADVANCED_GROUP,
			description: "Enables Hot Module Replacement."
		},
		{
			name: "debug",
			type: Boolean,
			group: BASIC_GROUP,
			description: "Switch loaders to debug mode"
		},
		{
			name: "devtool",
			/* TODO: Read based on mode */
			type: string => ArgsValidator.setString(string, "eval"),
			group: BASIC_GROUP,
			description: "Determine which source maps to use when bundling."
		},
		{
			name: "resolve-alias",
			type: String,
			group: RESOLVE_GROUP,
			description: "Expose aliases to import modules from."
		},
		{
			name: "resolve-extensions",
			type: Array,
			group: RESOLVE_GROUP,
			description: "Resolve specified extensions."
		},
		{
			name: "resolve-loader-alias",
			type: String,
			group: RESOLVE_GROUP,
			description: "Setup a loader alias for resolving."
		},
		{
			name: "optimize-max-chunks",
			type: String,
			group: OPTIMIZE_GROUP,
			description: "TODO. optimize needs new args."
		},
		{
			name: "optimize-minimize",
			type: Boolean,
			group: OPTIMIZE_GROUP,
			description: ""
		},
		{
			name: "prefetch",
			type: String,
			group: ADVANCED_GROUP,
			description: "Prefetch this request. [ex: --prefetch ./file.js]"
		},
		{
			name: "provide",
			type: String,
			group: ADVANCED_GROUP,
			description:
				"Provide these modules as free vars in all modules. [ex: --provide jQuery=jquery]"
		},
		{
			name: "silent",
			type: Boolean,
			description: "Prevent output from being displayed in stdout"
		},
		{
			name: "json",
			type: Boolean,
			alias: "j",
			description: "Prints the result as JSON."
		},
		{
			name: "labeled-modules",
			type: Boolean,
			group: ADVANCED_GROUP,
			description: "Enables labeled modules."
		},
		{
			name: "plugin",
			type: String,
			group: ADVANCED_GROUP,
			description: "Load a given plugin."
		},
		{
			name: "bail",
			type: String,
			group: ADVANCED_GROUP,
			description: "Fail on first error."
		},
		{
			name: "profile",
			type: Boolean,
			group: ADVANCED_GROUP,
			description:
				"Profile a bundle with stats and information to use with analyze tools."
		},
		{
			name: "dev",
			alias: "d",
			type: Boolean,
			group: BASIC_GROUP,
			description: "Run webpack for development"
		},
		{
			name: "prod",
			alias: "p",
			type: Boolean,
			defaultValue: true,
			group: BASIC_GROUP,
			description: "Run webpack for production"
		}
	]
};
