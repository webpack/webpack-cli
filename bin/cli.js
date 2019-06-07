#!/usr/bin/env node

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

const { NON_COMPILATION_ARGS } = require("./utils/constants");

(function() {
	// wrap in IIFE to be able to use return

	const importLocal = require("import-local");
	// Prefer the local installation of webpack-cli
	if (importLocal(__filename)) {
		return;
	}

	require("v8-compile-cache");

	const ErrorHelpers = require("./utils/errorHelpers");

	const NON_COMPILATION_CMD = process.argv.find(arg => {
		if (arg === "serve") {
			global.process.argv = global.process.argv.filter(a => a !== "serve");
			process.argv = global.process.argv;
		}
		return NON_COMPILATION_ARGS.find(a => a === arg);
	});

	if (NON_COMPILATION_CMD) {
		return require("./utils/prompt-command")(NON_COMPILATION_CMD, ...process.argv);
	}

	const yargs = require("yargs").usage(`webpack-cli ${require("../package.json").version}

Usage: webpack-cli [options]
       webpack-cli [options] --entry <entry> --output <output>
       webpack-cli [options] <entries...> --output <output>
       webpack-cli <command> [options]

For more information, see https://webpack.js.org/api/cli/.`);

	require("./config/config-yargs")(yargs);

	// yargs will terminate the process early when the user uses help or version.
	// This causes large help outputs to be cut short (https://github.com/nodejs/node/wiki/API-changes-between-v0.10-and-v4#process).
	// To prevent this we use the yargs.parse API and exit the process normally
	yargs.parse(process.argv.slice(2), (err, argv, output) => {
		Error.stackTraceLimit = 30;

		// arguments validation failed
		if (err && output) {
			console.error(output);
			process.exitCode = 1;
			return;
		}

		// help or version info
		if (output) {
			console.log(output);
			return;
		}

		if (argv.verbose) {
			argv["display"] = "verbose";
		}

		let options;
		try {
			options = require("./utils/convert-argv")(argv);
		} catch (err) {
			if (err.code === "MODULE_NOT_FOUND") {
				let errorMessage =
					"\n\u001b[31mwebpack not installed, consider installing it using \n\u001b[32mnpm install --save-dev webpack\n";

				if (process.env.npm_execpath !== undefined && process.env.npm_execpath.includes("yarn")) {
					errorMessage =
						"\n\u001b[31mwebpack not installed, consider installing it using \n\u001b[32myarn add webpack --dev\n";
				}

				console.error(errorMessage);
				Error.stackTraceLimit = 1;
				process.exitCode = 1;
				return;
			}

			if (err.name !== "ValidationError") {
				throw err;
			}

			const stack = ErrorHelpers.cleanUpWebpackOptions(err.stack, err.message);
			const message = err.message + "\n" + stack;

			if (argv.color) {
				console.error(`\u001b[1m\u001b[31m${message}\u001b[39m\u001b[22m`);
			} else {
				console.error(message);
			}

			process.exitCode = 1;
			return;
		}

		/**
		 * When --silent flag is present, an object with a no-op write method is
		 * used in place of process.stout
		 */
		const stdout = argv.silent ? { write: () => {} } : process.stdout;

		function ifArg(name, fn, init) {
			if (Array.isArray(argv[name])) {
				if (init) init();
				argv[name].forEach(fn);
			} else if (typeof argv[name] !== "undefined") {
				if (init) init();
				fn(argv[name], -1);
			}
		}

		function processOptions(options) {
			// process Promise
			if (typeof options.then === "function") {
				options.then(processOptions).catch(function(err) {
					console.error(err.stack || err);
					// eslint-disable-next-line no-process-exit
					process.exit(1);
				});
				return;
			}

			const firstOptions = [].concat(options)[0];
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
			if (typeof outputOptions.context === "undefined") outputOptions.context = firstOptions.context;

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

			const webpack = require("webpack");

			let lastHash = null;
			let compiler;
			try {
				compiler = webpack(options);
			} catch (err) {
				if (err.name === "WebpackOptionsValidationError") {
					if (argv.color) console.error(`\u001b[1m\u001b[31m${err.message}\u001b[39m\u001b[22m`);
					else console.error(err.message);
					// eslint-disable-next-line no-process-exit
					process.exit(1);
				}

				throw err;
			}

			if (argv.progress) {
				const ProgressPlugin = require("webpack").ProgressPlugin;
				new ProgressPlugin({
					profile: argv.profile
				}).apply(compiler);
			}
			if (outputOptions.infoVerbosity === "verbose") {
				if (argv.w) {
					compiler.hooks.watchRun.tap("WebpackInfo", compilation => {
						const compilationName = compilation.name ? compilation.name : "";
						console.error("\nCompilation " + compilationName + " starting…\n");
					});
				} else {
					compiler.hooks.beforeRun.tap("WebpackInfo", compilation => {
						const compilationName = compilation.name ? compilation.name : "";
						console.error("\nCompilation " + compilationName + " starting…\n");
					});
				}
				compiler.hooks.done.tap("WebpackInfo", compilation => {
					const compilationName = compilation.name ? compilation.name : "";
					console.error("\nCompilation " + compilationName + " finished\n");
				});
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
					process.exit(1); // eslint-disable-line
				}
				if (outputOptions.json) {
					stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n");
				} else if (stats.hash !== lastHash) {
					lastHash = stats.hash;
					if (stats.compilation && stats.compilation.errors.length !== 0) {
						const errors = stats.compilation.errors;
						if (errors[0].name === "EntryModuleNotFoundError") {
							console.error("\n\u001b[1m\u001b[31mInsufficient number of arguments or no entry found.");
							console.error(
								"\u001b[1m\u001b[31mAlternatively, run 'webpack(-cli) --help' for usage info.\u001b[39m\u001b[22m\n"
							);
						}
					}
					const statsString = stats.toString(outputOptions);
					const delimiter = outputOptions.buildDelimiter ? `${outputOptions.buildDelimiter}\n` : "";
					if (statsString) stdout.write(`${statsString}\n${delimiter}`);

					/**
					 * Show a hint to donate to our Opencollective
					 * once a week, only on Monday
					 */
					const openCollectivePath = __dirname + "/opencollective.js";
					const MONDAY = 1;
					const SIX_DAYS = 518400000;
					const now = new Date();
					if (now.getDay() === MONDAY) {
						const { access, constants, statSync, utimesSync } = require("fs");
						const stat = statSync(openCollectivePath);
						const lastPrint = stat.atime;
						const fileOwnerId = stat.uid;
						const lastPrintTS = new Date(lastPrint).getTime();
						const timeSinceLastPrint = now.getTime() - lastPrintTS;
						if (timeSinceLastPrint > SIX_DAYS) {
							require(openCollectivePath);
							// On windows we need to manually update the atime
							// Updating utime requires process owner is as same as file owner
							access(openCollectivePath, constants.W_OK, e => {
								if (!e && fileOwnerId === process.getuid()) utimesSync(openCollectivePath, now, now);
							});
						}
					}
				}
				if (!options.watch && stats.hasErrors()) {
					process.exitCode = 2;
				}
			}
			if (firstOptions.watch || options.watch) {
				const watchOptions =
					firstOptions.watchOptions || options.watchOptions || firstOptions.watch || options.watch || {};
				if (watchOptions.stdin) {
					process.stdin.on("end", function(_) {
						process.exit(); // eslint-disable-line
					});
					process.stdin.resume();
				}
				compiler.watch(watchOptions, compilerCallback);
				if (outputOptions.infoVerbosity !== "none") console.error("\nwebpack is watching the files…\n");
			} else {
				compiler.run((err, stats) => {
					if (compiler.close) {
						compiler.close(err2 => {
							compilerCallback(err || err2, stats);
						});
					} else {
						compilerCallback(err, stats);
					}
				});
			}
		}
		processOptions(options);
	});
})();
