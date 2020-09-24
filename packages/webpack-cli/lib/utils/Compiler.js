const webpack = require('webpack');
const logger = require('./logger');
const bailAndWatchWarning = require('./warnings/bailAndWatchWarning');
const { CompilerOutput } = require('./CompilerOutput');

class Compiler {
    constructor() {
        this.output = new CompilerOutput();
        this.compilerOptions = {};
    }
    setUpHookForCompilation(compilation, outputOptions, options) {
        const { ProgressPlugin } = webpack;
        let progressPluginExists;
        if (options.plugins) {
            progressPluginExists = options.plugins.find((e) => e instanceof ProgressPlugin);
        }

        compilation.hooks.beforeRun.tap('webpackProgress', () => {
            if (outputOptions.progress) {
                if (!progressPluginExists) {
                    new ProgressPlugin().apply(compilation);
                } else {
                    if (!progressPluginExists.handler) {
                        options.plugins = options.plugins.filter((e) => e !== progressPluginExists);
                        Object.keys(progressPluginExists).map((opt) => {
                            ProgressPlugin.defaultOptions[opt] = progressPluginExists[opt];
                        });
                        new ProgressPlugin().apply(compilation);
                    } else {
                        progressPluginExists.apply(compilation);
                    }
                }
            }
        });
    }

    generateOutput(outputOptions, stats) {
        this.output.generateRawOutput(stats, this.compilerOptions);
        process.stdout.write('\n');
        if (outputOptions.watch) {
            logger.info('watching files for updates...');
        }
    }

    compilerCallback(err, stats, lastHash, options, outputOptions) {
        const statsErrors = [];

        if (!outputOptions.watch || err) {
            // Do not keep cache anymore
            this.compiler.purgeInputFileSystem();
        }
        if (err) {
            lastHash = null;
            logger.error(err.stack || err);
            process.exit(1); // eslint-disable-line
        }
        if (!outputOptions.watch && (stats.hasErrors() || stats.hasWarnings())) {
            process.exitCode = 1;
        }
        if (outputOptions.json) {
            process.stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + '\n');
        } else if (stats.hash !== lastHash) {
            lastHash = stats.hash;
            if (stats.compilation && stats.compilation.errors.length !== 0) {
                const errors = stats.compilation.errors;
                errors.forEach((statErr) => {
                    const errLoc = statErr.module ? statErr.module.resource : null;
                    statsErrors.push({ name: statErr.message, loc: errLoc });
                });
            }
            return this.generateOutput(outputOptions, stats, statsErrors);
        }
    }

    async invokeCompilerInstance(lastHash, options, outputOptions) {
        // eslint-disable-next-line  no-async-promise-executor
        return new Promise(async (resolve) => {
            await this.compiler.run((err, stats) => {
                const content = this.compilerCallback(err, stats, lastHash, options, outputOptions);
                resolve(content);
            });
        });
    }

    async invokeWatchInstance(lastHash, options, outputOptions, watchOptions) {
        return this.compiler.watch(watchOptions, (err, stats) => {
            return this.compilerCallback(err, stats, lastHash, options, outputOptions);
        });
    }

    async createCompiler(options) {
        try {
            this.compiler = await webpack(options);
            this.compilerOptions = options;
        } catch (err) {
            process.stdout.write('\n');
            logger.error(`${err.name}: ${err.message}`);
            process.stdout.write('\n');
            return;
        }
    }

    get getCompiler() {
        return this.compiler;
    }

    async webpackInstance(opts) {
        const { outputOptions, options } = opts;
        const lastHash = null;

        const { ProgressPlugin } = webpack;
        if (options.plugins) {
            options.plugins = options.plugins.filter((e) => e instanceof ProgressPlugin);
        }

        if (outputOptions.interactive) {
            const interactive = require('./interactive');
            return interactive(options, outputOptions);
        }

        if (this.compiler.compilers) {
            this.compiler.compilers.forEach((comp, idx) => {
                bailAndWatchWarning(comp); //warn the user if bail and watch both are used together
                this.setUpHookForCompilation(comp, outputOptions, options[idx]);
            });
        } else {
            bailAndWatchWarning(this.compiler);
            this.setUpHookForCompilation(this.compiler, outputOptions, options);
        }

        if (outputOptions.watch) {
            const watchOptions = outputOptions.watchOptions || {};
            if (watchOptions.stdin) {
                process.stdin.on('end', function () {
                    process.exit();
                });
                process.stdin.resume();
            }
            await this.invokeWatchInstance(lastHash, options, outputOptions, watchOptions);
        } else {
            return await this.invokeCompilerInstance(lastHash, options, outputOptions);
        }
    }
}

module.exports = { Compiler };
