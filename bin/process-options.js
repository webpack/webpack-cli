module.exports = function processOptions(yargs, argv) {
	// process Promise
	function ifArg(name, fn, init) {
		if (Array.isArray(argv[name])) {
			if (init) init();
			argv[name].forEach(fn);
		} else if (typeof argv[name] !== "undefined") {
			if (init) init();
			fn(argv[name], -1);
		}
	}
	var options = require("./convert-argv")(yargs, argv);

	if (typeof options.then === "function") {
		options.then(processOptions).catch(function(err) {
			console.error(err.stack || err);
			process.exit();
		});
		return;
	}

	var firstOptions = Array.isArray(options) ? options[0] || {} : options;

	if (typeof options.stats === "boolean" || typeof options.stats === "string") {
		var statsPresetToOptions = require("webpack/lib/Stats.js").presetToOptions;
		options.stats = statsPresetToOptions(options.stats);
	}

	var outputOptions = Object.create(options.stats || firstOptions.stats || {});
	if (typeof outputOptions.context === "undefined")
		outputOptions.context = firstOptions.context;

	ifArg("json", function(bool) {
		if (bool) outputOptions.json = bool;
	});

	if (typeof outputOptions.colors === "undefined")
		outputOptions.colors = require("supports-color");

	ifArg("sort-modules-by", function(value) {
		outputOptions.modulesSort = value;
	});

	ifArg("sort-chunks-by", function(value) {
		outputOptions.chunksSort = value;
	});

	ifArg("sort-assets-by", function(value) {
		outputOptions.assetsSort = value;
	});

	ifArg("display-exclude", function(value) {
		outputOptions.exclude = value;
	});

	if (!outputOptions.json) {
		if (typeof outputOptions.cached === "undefined")
			outputOptions.cached = false;
		if (typeof outputOptions.cachedAssets === "undefined")
			outputOptions.cachedAssets = false;

		ifArg("display-chunks", function(bool) {
			outputOptions.modules = !bool;
			outputOptions.chunks = bool;
		});

		ifArg("display-entrypoints", function(bool) {
			outputOptions.entrypoints = bool;
		});

		ifArg("display-reasons", function(bool) {
			outputOptions.reasons = bool;
		});

		ifArg("display-used-exports", function(bool) {
			outputOptions.usedExports = bool;
		});

		ifArg("display-provided-exports", function(bool) {
			outputOptions.providedExports = bool;
		});

		ifArg("display-error-details", function(bool) {
			outputOptions.errorDetails = bool;
		});

		ifArg("display-origins", function(bool) {
			outputOptions.chunkOrigins = bool;
		});

		ifArg("display-cached", function(bool) {
			if (bool) outputOptions.cached = true;
		});

		ifArg("display-cached-assets", function(bool) {
			if (bool) outputOptions.cachedAssets = true;
		});

		if (!outputOptions.exclude && !argv["display-modules"])
			outputOptions.exclude = [
				"node_modules",
				"bower_components",
				"jam",
				"components"
			];
	} else {
		if (typeof outputOptions.chunks === "undefined")
			outputOptions.chunks = true;
		if (typeof outputOptions.entrypoints === "undefined")
			outputOptions.entrypoints = true;
		if (typeof outputOptions.modules === "undefined")
			outputOptions.modules = true;
		if (typeof outputOptions.chunkModules === "undefined")
			outputOptions.chunkModules = true;
		if (typeof outputOptions.reasons === "undefined")
			outputOptions.reasons = true;
		if (typeof outputOptions.cached === "undefined")
			outputOptions.cached = true;
		if (typeof outputOptions.cachedAssets === "undefined")
			outputOptions.cachedAssets = true;
	}

	ifArg("hide-modules", function(bool) {
		if (bool) {
			outputOptions.modules = false;
			outputOptions.chunkModules = false;
		}
	});

	var webpack = require("webpack/lib/webpack.js");

	Error.stackTraceLimit = 30;
	var lastHash = null;
	var compiler;
	try {
		compiler = webpack(options);
	} catch (e) {
		var WebpackOptionsValidationError = require("webpack/lib/WebpackOptionsValidationError");
		if (e instanceof WebpackOptionsValidationError) {
			if (argv.color)
				console.error(
					"\u001b[1m\u001b[31m" + e.message + "\u001b[39m\u001b[22m"
				);
			else console.error(e.message);
			process.exitCode = 1;
		}
		throw e;
	}

	if (argv.progress) {
		var ProgressPlugin = require("webpack/lib/ProgressPlugin");
		compiler.apply(
			new ProgressPlugin({
				profile: argv.profile
			})
		);
	}

	function compilerCallback(err, stats) {
		if (!options.watch || err) {
			// Do not keep cache anymore
			compiler.purgeInputFileSystem();
		}
		if (err) {
			lastHash = null;
			console.error(err.stack || err);
			if (err.details) console.error(err.details);
			process.exitCode = 1;
		}
		if (outputOptions.json) {
			process.stdout.write(
				JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n"
			);
		} else if (stats.hash !== lastHash) {
			lastHash = stats.hash;
			process.stdout.write("\n" + new Date() + "\n" + "\n");
			process.stdout.write(stats.toString(outputOptions) + "\n");
			if (argv.s) lastHash = null;
		}
		if (!options.watch && stats.hasErrors()) {
			process.on("exit", function(_) {
				process.exitCode = 2;
			});
		}
	}
	if (options.watch) {
		var primaryOptions = !Array.isArray(options) ? options : options[0];
		var watchOptions =
			primaryOptions.watchOptions || primaryOptions.watch || {};
		if (watchOptions.stdin) {
			process.stdin.on("end", function(_) {
				process.exitCode = 0;
			});
			process.stdin.resume();
		}
		compiler.watch(watchOptions, compilerCallback);
		console.log("\nWebpack is watching the files…\n");
	} else compiler.run(compilerCallback);
};
