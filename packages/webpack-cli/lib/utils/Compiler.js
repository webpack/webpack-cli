const { options: coloretteOptions } = require('colorette');
const { packageExists } = require('./package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const logger = require('./logger');
const { writeFileSync } = require('fs');

class Compiler {
    constructor() {
        this.compilerOptions = {};
    }

    async createCompiler(options) {
        try {
            this.compiler = await webpack(options);
            this.compilerOptions = options;
        } catch (error) {
            // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
            // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
            const ValidationError = webpack.ValidationError ? webpack.ValidationError : webpack.WebpackOptionsValidationError;

            // In case of schema errors print and exit process
            // For webpack@4 and webpack@5
            if (error instanceof ValidationError) {
                logger.error(error.message);
            } else {
                logger.error(error);
            }

            process.exit(2);
        }
    }

    get getCompiler() {
        return this.compiler;
    }

    async webpackInstance(opts) {
        const { outputOptions, options } = opts;

        if (outputOptions.interactive) {
            const interactive = require('./interactive');

            return interactive(options, outputOptions);
        }

        const compilers = this.compiler.compilers ? this.compiler.compilers : [this.compiler];
        const isWatchMode = Boolean(compilers.find((compiler) => compiler.options.watch));
        const isRawOutput = typeof outputOptions.json === 'undefined';

        if (isRawOutput) {
            for (const compiler of compilers) {
                if (outputOptions.progress) {
                    const { ProgressPlugin } = webpack;

                    let progressPluginExists;

                    if (compiler.options.plugins) {
                        progressPluginExists = Boolean(compiler.options.plugins.find((e) => e instanceof ProgressPlugin));
                    }

                    if (!progressPluginExists) {
                        new ProgressPlugin().apply(compiler);
                    }
                }
            }

            this.compiler.hooks.watchRun.tap('watchInfo', (compilation) => {
                if (compilation.options.bail && isWatchMode) {
                    logger.warn('You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.');
                }

                logger.success(`Compilation${compilation.name ? `${compilation.name}` : ''} starting...`);
            });
            this.compiler.hooks.done.tap('watchInfo', (compilation) => {
                logger.success(`Compilation${compilation.name ? `${compilation.name}` : ''} finished`);
            });
        }

        const callback = (error, stats) => {
            if (error) {
                logger.error(error);
                process.exit(1);
            }

            if (stats.hasErrors()) {
                process.exitCode = 1;
            }

            const getStatsOptions = (stats) => {
                stats.colors = typeof stats.colors !== 'undefined' ? stats.colors : coloretteOptions.enabled;

                return stats;
            };

            const foundStats = this.compiler.compilers
                ? { children: this.compiler.compilers.map((compiler) => getStatsOptions(compiler.options.stats)) }
                : getStatsOptions(this.compiler.options.stats);

            if (outputOptions.json === true) {
                process.stdout.write(JSON.stringify(stats.toJson(foundStats), null, 2) + '\n');
            } else if (typeof outputOptions.json === 'string') {
                const JSONStats = JSON.stringify(stats.toJson(foundStats), null, 2);

                try {
                    writeFileSync(outputOptions.json, JSONStats);
                    logger.success(`stats are successfully stored as json to ${outputOptions.json}`);
                } catch (error) {
                    logger.error(error);

                    process.exit(2);
                }
            } else {
                logger.raw(`${stats.toString(foundStats)}`);
            }

            if (isWatchMode) {
                logger.success('watching files for updates...');
            }
        };

        if (isWatchMode) {
            const watchOptions = (this.compiler.options && this.compiler.options.watchOptions) || {};

            if (watchOptions.stdin) {
                process.stdin.on('end', function () {
                    process.exit();
                });
                process.stdin.resume();
            }

            return new Promise((resolve) => {
                this.compiler.watch(watchOptions, (error, stats) => {
                    callback(error, stats);

                    resolve();
                });
            });
        } else {
            return new Promise((resolve) => {
                this.compiler.run((error, stats) => {
                    if (this.compiler.close) {
                        this.compiler.close(() => {
                            callback(error, stats);

                            resolve();
                        });
                    } else {
                        callback(error, stats);

                        resolve();
                    }
                });
            });
        }
    }
}

module.exports = { Compiler };
