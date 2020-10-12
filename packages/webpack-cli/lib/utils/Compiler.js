const { packageExists } = require('./package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const logger = require('./logger');
const { writeFileSync } = require('fs');

class Compiler {
    constructor() {
        this.compilerOptions = {};
    }

    compilerCallback(error, compiler, stats, outputOptions) {
        if (error) {
            logger.error(error);
            process.exit(1);
        }

        if (stats.hasErrors()) {
            process.exitCode = 1;
        }

        if (outputOptions.json === true) {
            process.stdout.write(JSON.stringify(stats.toJson(compiler.options.stats), null, 2) + '\n');
        } else if (typeof outputOptions.json === 'string') {
            const JSONStats = JSON.stringify(stats.toJson(compiler.options.stats), null, 2);

            try {
                writeFileSync(outputOptions.json, JSONStats);
                logger.success(`stats are successfully stored as json to ${outputOptions.json}`);
            } catch (error) {
                logger.error(error);

                process.exit(2);
            }
        } else {
            logger.raw(`${stats.toString(compiler.options.stats)}`);
        }

        if (compiler.options.watch) {
            logger.success('watching files for updates...');
        }
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

        for (const compiler of compilers) {
            if (compiler.options.bail && compiler.options.watch) {
                logger.warn('You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.');
            }

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

            if (compiler.options.watch) {
                const watchOptions = compiler.options.watchOptions || {};

                if (watchOptions.stdin) {
                    process.stdin.on('end', function () {
                        process.exit();
                    });
                    process.stdin.resume();
                }

                compiler.hooks.watchRun.tap('watchInfo', (compilation) => {
                    logger.success(`Compilation${compilation.name ? `${compilation.name}` : ''} starting...`);
                });
                compiler.hooks.done.tap('watchInfo', (compilation) => {
                    logger.success(`Compilation${compilation.name ? `${compilation.name}` : ''} finished`);
                });

                return new Promise((resolve) => {
                    compiler.watch(watchOptions, (error, stats) => {
                        this.compilerCallback(error, compiler, stats, outputOptions);

                        resolve();
                    });
                });
            } else {
                return new Promise((resolve) => {
                    compiler.run((error, stats) => {
                        if (compiler.close) {
                            compiler.close(() => {
                                this.compilerCallback(error, compiler, stats, outputOptions);

                                resolve();
                            });
                        } else {
                            this.compilerCallback(error, compiler, stats, outputOptions);

                            resolve();
                        }
                    });
                });
            }
        }
    }
}

module.exports = { Compiler };
