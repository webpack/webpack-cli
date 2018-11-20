const webpack = require("webpack");

function compilerCallback(compiler, err, stats, lastHash, options, outputOptions) {

	const stdout = options.silent
			? {
				write: () => {}
			  } // eslint-disable-line
			: process.stdout;
	
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
				console.error(
					"\n\u001b[1m\u001b[31mInsufficient number of arguments or no entry found."
				);
				console.error(
					"\u001b[1m\u001b[31mAlternatively, run 'webpack(-cli) --help' for usage info.\u001b[39m\u001b[22m\n"
				);
			}
		}
		const statsString = stats.toString(outputOptions);
		const delimiter = outputOptions.buildDelimiter
			? `${outputOptions.buildDelimiter}\n`
			: "";
		if (statsString) stdout.write(`${statsString}\n${delimiter}`);
	}
	if (!options.watch && stats.hasErrors()) {
		process.exitCode = 2;
	}
}

module.exports = function webpackInstance(options) {
	const { webpackOptions, processingErrors, outputOptions } = options;
	
	if (webpackOptions.help) {
		console.error(webpackOptions.help);
		return;
	}
	if (processingErrors.length > 0) {
		throw new Error(result.processingErrors);
	}
	if (process.shouldUseMem) {
		// TODO: use memfs for people to use webpack with fake paths
	}

	let compiler;
	let lastHash = null;

	try {
		compiler = webpack(outputOptions);
	} catch (err) {
		if (err.name === "WebpackOptionsValidationError") {
			if (options.color)
				console.error(`\u001b[1m\u001b[31m${err.message}\u001b[39m\u001b[22m`);
			else console.error(err.message);
			// eslint-disable-next-line no-process-exit
			process.exit(1);
		}
		throw err;
	}
	/* TODO: func inside this module would make it unreadable, so some kind of
   * scope exposure would be better.
   * */
	compiler.run(function(err, stats) {
		return compilerCallback(compiler, err, stats, lastHash, webpackOptions, outputOptions)
	});
	return compiler;
};
