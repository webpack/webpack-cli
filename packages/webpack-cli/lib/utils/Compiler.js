const { packageExists } = require('./package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const logger = require('./logger');
const { writeFileSync } = require('fs');
const bailAndWatchWarning = require('./warnings/bailAndWatchWarning');

const assignWatchHooks = (compiler) => {
    compiler.hooks.watchRun.tap('watchInfo', (compilation) => {
        const compilationName = compilation.name || '';
        logger.raw(`\nCompilation ${compilationName} starting…\n`);
    });
    compiler.hooks.done.tap('watchInfo', (compilation) => {
        const compilationName = compilation.name || '';
        logger.raw(`\nCompilation ${compilationName} finished\n`);
    });
};

const watchInfo = (compiler) => {
    if (compiler.compilers) {
        compiler.compilers.map((comp) => {
            assignWatchHooks(comp);
        });
    } else {
        assignWatchHooks(compiler);
    }
};

class Compiler {
    constructor() {
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

    compilerCallback(error, stats, lastHash, options, outputOptions) {
        if (error) {
            lastHash = null;
            logger.error(error);
            process.exit(1);
        }

        if (!outputOptions.watch && stats.hasErrors()) {
            process.exitCode = 1;
        }

        if (stats.hash !== lastHash) {
            lastHash = stats.hash;

            if (outputOptions.json === true) {
                process.stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + '\n');
            } else if (typeof outputOptions.json === 'string') {
                const JSONStats = JSON.stringify(stats.toJson(outputOptions), null, 2);

                try {
                    writeFileSync(outputOptions.json, JSONStats);
                    logger.success(`stats are successfully stored as json to ${outputOptions.json}`);
                } catch (err) {
                    logger.error(err);
                }
            } else {
                logger.raw(`${stats.toString(this.compilerOptions.stats)}\n`);
            }

            if (outputOptions.watch) {
                logger.info('watching files for updates...');
            }
        }
    }

    async invokeCompilerInstance(lastHash, options, outputOptions) {
        // eslint-disable-next-line  no-async-promise-executor
        return new Promise(async (resolve) => {
            await this.compiler.run((err, stats) => {
                if (this.compiler.close) {
                    this.compiler.close(() => {
                        this.compilerCallback(err, stats, lastHash, options, outputOptions);

                        resolve();
                    });
                } else {
                    this.compilerCallback(err, stats, lastHash, options, outputOptions);

                    resolve();
                }
            });
        });
    }

    async invokeWatchInstance(lastHash, options, outputOptions, watchOptions) {
        return this.compiler.watch(watchOptions, (err, stats) => {
            this.compilerCallback(err, stats, lastHash, options, outputOptions);
        });
    }

    async createCompiler(options, outputOptions) {
        try {
            if (options.watch) {
                this.compiler = await webpack(options, (err, stats) => {
                    this.compilerCallback(err, stats, null, options, outputOptions);
                });
            } else {
                this.compiler = await webpack(options);
            }

            this.compilerOptions = options;
        } catch (err) {
            // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
            // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
            const ValidationError = webpack.ValidationError ? webpack.ValidationError : webpack.WebpackOptionsValidationError;
            // In case of schema errors print and exit process
            // For webpack@4 and webpack@5
            if (err instanceof ValidationError) {
                logger.error(`\n${err.message}`);
            } else {
                logger.error(`\n${err}`);
            }
            process.exit(2);
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
            watchInfo(this.compiler);
        } else {
            return await this.invokeCompilerInstance(lastHash, options, outputOptions);
        }
    }
}

module.exports = { Compiler };
