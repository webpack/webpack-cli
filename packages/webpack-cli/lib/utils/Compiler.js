const webpack = require('webpack');
const logger = require('./logger');
const { cyanBright, greenBright } = require('chalk');
const { CompilerOutput } = require('./CompilerOutput');
const readline = require('readline');

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
                process.stdout.write('\n');
                const defaultProgressPluginHandler = (percent, msg) => {
                    percent = Math.floor(percent * 100);
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0, null);
                    if (percent !== undefined) {
                        process.stdout.write(' (');
                        for (let i = 0; i <= 100; i += 10) {
                            if (i <= percent) {
                                process.stdout.write(greenBright('#'));
                            } else {
                                process.stdout.write('#');
                            }
                        }
                        process.stdout.write(`) ${percent}% : `);
                        process.stdout.write(`${cyanBright(msg)}`);
                        if (percent === 100) {
                            process.stdout.write(`${cyanBright('Compilation completed\n')}`);
                        }
                    }
                };
                if (!progressPluginExists) {
                    new ProgressPlugin(defaultProgressPluginHandler).apply(compilation);
                } else {
                    if (!progressPluginExists.handler) {
                        options.plugins = options.plugins.filter((e) => e !== progressPluginExists);
                        Object.keys(progressPluginExists).map((opt) => {
                            ProgressPlugin.defaultOptions[opt] = progressPluginExists[opt];
                        });
                        new ProgressPlugin(defaultProgressPluginHandler).apply(compilation);
                    } else {
                        progressPluginExists.apply(compilation);
                    }
                }
            }
        });
    }

    showEmojiConditionally() {
        return process.stdout.isTTY && process.platform === 'darwin';
    }

    generateOutput(outputOptions, stats) {
        this.output.generateRawOutput(stats, this.compilerOptions);
        process.stdout.write('\n');
        if (outputOptions.watch) {
            logger.info('watching files for updates...');
        }
    }

    compilerCallback(err, stats, lastHash, options, outputOptions, processingMessageBuffer) {
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
        if (outputOptions.json && !outputOptions.silent) {
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
            if (!outputOptions.silent) {
                return this.generateOutput(outputOptions, stats, statsErrors, processingMessageBuffer);
            }
        }
        if (!outputOptions.watch && stats.hasErrors()) {
            process.exitCode = 2;
        }
    }

    async invokeCompilerInstance(lastHash, options, outputOptions, processingMessageBuffer) {
        // eslint-disable-next-line  no-async-promise-executor
        return new Promise(async (resolve) => {
            await this.compiler.run((err, stats) => {
                const content = this.compilerCallback(err, stats, lastHash, options, outputOptions, processingMessageBuffer);
                resolve(content);
            });
        });
    }

    async invokeWatchInstance(lastHash, options, outputOptions, watchOptions, processingMessageBuffer) {
        return this.compiler.watch(watchOptions, (err, stats) => {
            return this.compilerCallback(err, stats, lastHash, options, outputOptions, processingMessageBuffer);
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
        const { outputOptions, processingMessageBuffer, options } = opts;
        const lastHash = null;

        const { ProgressPlugin } = webpack;
        if (options.plugins) {
            options.plugins = options.plugins.filter((e) => e instanceof ProgressPlugin);
        }

        if (outputOptions.interactive) {
            const interactive = require('./interactive');
            return interactive(options, outputOptions, processingMessageBuffer);
        }

        if (this.compiler.compilers) {
            this.compiler.compilers.forEach((comp, idx) => {
                this.setUpHookForCompilation(comp, outputOptions, options[idx]);
            });
        } else {
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
            await this.invokeWatchInstance(lastHash, options, outputOptions, watchOptions, processingMessageBuffer);
        } else {
            return await this.invokeCompilerInstance(lastHash, options, outputOptions, processingMessageBuffer);
        }
    }
}

module.exports = { Compiler };
