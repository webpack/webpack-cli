module.exports = argv => options => {
	function ifArg(name, fn, init) {
		if (Array.isArray(argv[name])) {
			if (init) init();
			argv[name].forEach(fn);
		} else if (typeof argv[name] !== "undefined") {
			if (init) init();
			fn(argv[name], -1);
		}
	}

	const statsPresetToOptions = require("webpack").Stats.presetToOptions;

	let outputOptions = options.stats;
	if (typeof outputOptions === "boolean" || typeof outputOptions === "string") {
		outputOptions = statsPresetToOptions(outputOptions);
	} else if (!outputOptions) {
		outputOptions = {};
	}

	ifArg("display", function(preset) {
		outputOptions = statsPresetToOptions(preset);
	});

	outputOptions = Object.create(outputOptions);
	if (Array.isArray(options) && !outputOptions.children) {
		outputOptions.children = options.map(o => o.stats);
	}
	if (typeof outputOptions.context === "undefined") outputOptions.context = [].concat(options)[0].context;

	ifArg("env", function(value) {
		if (outputOptions.env) {
			outputOptions._env = value;
		}
	});

	ifArg("json", function(bool) {
		if (bool) {
			outputOptions.json = bool;
			outputOptions.modules = bool;
		}
	});

	if (typeof outputOptions.colors === "undefined") outputOptions.colors = require("supports-color").stdout;

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
		if (typeof outputOptions.cached === "undefined") outputOptions.cached = false;
		if (typeof outputOptions.cachedAssets === "undefined") outputOptions.cachedAssets = false;

		ifArg("display-chunks", function(bool) {
			if (bool) {
				outputOptions.modules = false;
				outputOptions.chunks = true;
				outputOptions.chunkModules = true;
			}
		});

		ifArg("display-entrypoints", function(bool) {
			outputOptions.entrypoints = bool;
		});

		ifArg("display-reasons", function(bool) {
			if (bool) outputOptions.reasons = true;
		});

		ifArg("display-depth", function(bool) {
			if (bool) outputOptions.depth = true;
		});

		ifArg("display-used-exports", function(bool) {
			if (bool) outputOptions.usedExports = true;
		});

		ifArg("display-provided-exports", function(bool) {
			if (bool) outputOptions.providedExports = true;
		});

		ifArg("display-optimization-bailout", function(bool) {
			if (bool) outputOptions.optimizationBailout = bool;
		});

		ifArg("display-error-details", function(bool) {
			if (bool) outputOptions.errorDetails = true;
		});

		ifArg("display-origins", function(bool) {
			if (bool) outputOptions.chunkOrigins = true;
		});

		ifArg("display-max-modules", function(value) {
			outputOptions.maxModules = +value;
		});

		ifArg("display-cached", function(bool) {
			if (bool) outputOptions.cached = true;
		});

		ifArg("display-cached-assets", function(bool) {
			if (bool) outputOptions.cachedAssets = true;
		});

		if (!outputOptions.exclude) outputOptions.exclude = ["node_modules", "bower_components", "components"];

		if (argv["display-modules"]) {
			outputOptions.maxModules = Infinity;
			outputOptions.exclude = undefined;
			outputOptions.modules = true;
		}
	}

	ifArg("hide-modules", function(bool) {
		if (bool) {
			outputOptions.modules = false;
			outputOptions.chunkModules = false;
		}
	});

	ifArg("info-verbosity", function(value) {
		outputOptions.infoVerbosity = value;
	});

	ifArg("build-delimiter", function(value) {
		outputOptions.buildDelimiter = value;
	});

	return outputOptions;
};
