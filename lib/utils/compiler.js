const webpack = require('webpack');
const chalk = require('chalk');
const Table = require('cli-table3');

function setUpHookForCompiler(compiler, outputOptions, options) {
    const { ProgressPlugin } = webpack;
    let progressPluginExists;
    if (options.plugins) {
        progressPluginExists = options.plugins.find(e => e instanceof ProgressPlugin);
    }

    compiler.hooks.beforeRun.tap('webpackProgress', () => {
        if (outputOptions.progress) {
            let tmpMsg;
            const defaultProgressPluginHandler = (percent, msg) => {
                percent = Math.floor(percent * 100);
                if (percent === 100) {
                    msg = 'Compilation completed';
                }

                if (msg && tmpMsg != msg) {
                    process.cliLogger.info(percent + '% ' + msg);
                }
                tmpMsg = msg;
            };
            if (!progressPluginExists) {
                new ProgressPlugin(defaultProgressPluginHandler).apply(compiler);
            } else {
                if (!progressPluginExists.handler) {
                    options.plugins = options.plugins.filter(e => e !== progressPluginExists);
                    Object.keys(progressPluginExists).map(opt => {
                        ProgressPlugin.defaultOptions[opt] = progressPluginExists[opt];
                    });
                    new ProgressPlugin(defaultProgressPluginHandler).apply(compiler);
                } else {
                    progressPluginExists.apply(compiler);
                }
            }
        }
    });

    if (outputOptions.infoVerbosity === 'verbose') {
        if (outputOptions.watch) {
            compiler.hooks.watchRun.tap('WebpackInfo', compilation => {
                const compilationName = compilation.name ? compilation.name : '';
                process.cliLogger.info('Compilation ' + compilationName + ' starting…');
            });
        } else {
            compiler.hooks.beforeRun.tap('WebpackInfo', compilation => {
                const compilationName = compilation.name ? compilation.name : '';
                process.cliLogger.info('Compilation ' + compilationName + ' starting…');
            });
        }
        compiler.hooks.done.tap('WebpackInfo', compilation => {
            const compilationName = compilation.name ? compilation.name : '';
            process.cliLogger.info('Compilation ' + compilationName + ' finished');
        });
    }
}

function showEmojiConditionally() {
    return process.stdout.isTTY && process.platform === 'darwin';
}

function generateOutputForSingleCompilation(statsObj, statsErrors, processingMessageBuffer) {
    const { assets, entrypoints, time, builtAt, warnings, outputPath } = statsObj;

    const visibleEmojies = showEmojiConditionally() ? ['✅', '🌏', '⚒️ ', '⏱ ', '📂'] : new Array(5).fill('');

    process.stdout.write('\n');
    process.stdout.write(`${visibleEmojies[0]} ${chalk.underline.bold('Compilation Results')}\n`);
    process.stdout.write('\n');
    process.stdout.write(`${visibleEmojies[1]} Version: ${webpack.version}\n`);
    process.stdout.write(`${visibleEmojies[2]} Built: ${new Date(builtAt).toString()}\n`);
    process.stdout.write(`${visibleEmojies[3]} Compile Time: ${time}ms\n`);
    process.stdout.write(`${visibleEmojies[4]} Output Directory: ${outputPath}\n`);
    process.stdout.write('\n');

    let entries = [];
    Object.keys(entrypoints).forEach(entry => {
        entries = entries.concat(entrypoints[entry].assets);
    });

    const table = new Table({
        head: ['Build Status', 'Bundle Name', 'Bundle Size'],
        colWidths: [15, 45, 15],
        style: { compact: true, 'padding-left': 1 },
    });

    let compilationTableEmpty = true;
    assets.forEach(asset => {
        if (entries.includes(asset.name)) {
            const kbSize = `${Math.round(asset.size / 1000)} kb`;
            const hasBeenCompiled = asset.emitted === true ? 'compiled' : 'failed';
            table.push([hasBeenCompiled, asset.name, kbSize]);
            compilationTableEmpty = false;
        }
    });

    if (!compilationTableEmpty) {
        process.stdout.write(table.toString());
    }

    if (processingMessageBuffer.length > 0) {
        processingMessageBuffer.forEach(buff => {
            if (buff.lvl === 'warn') {
                warnings.push(buff.msg);
            } else {
                statsErrors.push(buff.msg);
            }
        });
    }

    if (warnings) {
        warnings.forEach(warning => {
            process.stdout.write('\n\n');

            if (warning.message) {
                process.cliLogger.warn(warning.message);
                process.stdout.write('\n');
                process.cliLogger.warn(warning.stack);
                return;
            }
            process.cliLogger.warn(warning);
        });
        process.stdout.write('\n');
    }

    if (statsErrors) {
        statsErrors.forEach(err => {
            if (err.loc) process.cliLogger.warn(err.loc);
            if (err.name) {
                process.stdout.write('\n');
                process.cliLogger.error(err.name);
            }
        });
    }
    return statsObj;
}

function generateOutput(outputOptions, stats, statsErrors, processingMessageBuffer) {
    const statsObj = stats.toJson(outputOptions);
    if (statsObj.children && statsObj.children.length) {
        statsObj.children.forEach(child => {
            generateOutputForSingleCompilation(child, statsErrors, processingMessageBuffer);
        });
        return;
    }
    generateOutputForSingleCompilation(statsObj, statsErrors, processingMessageBuffer);
    process.stdout.write('\n');
    if (outputOptions.watch) {
        process.cliLogger.info('watching files for updates...');
    }
}

function compilerCallback(compiler, err, stats, lastHash, options, outputOptions, processingMessageBuffer) {
    const statsErrors = [];

    if (!outputOptions.watch || err) {
        // Do not keep cache anymore
        compiler.purgeInputFileSystem();
    }
    if (err) {
        lastHash = null;
        process.cliLogger.error(err.stack || err);
        process.exit(1); // eslint-disable-line
    }
    if (outputOptions.json && !outputOptions.silent) {
        process.stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + '\n');
    } else if (stats.hash !== lastHash) {
        lastHash = stats.hash;
        if (stats.compilation && stats.compilation.errors.length !== 0) {
            const errors = stats.compilation.errors;
            errors.forEach(statErr => {
                const errLoc = statErr.module ? statErr.module.resource : null;
                statsErrors.push({ name: statErr.message, loc: errLoc });
            });
        }
        if (!outputOptions.silent) {
            return generateOutput(outputOptions, stats, statsErrors, processingMessageBuffer);
        }
    }
    if (!outputOptions.watch && stats.hasErrors()) {
        process.exitCode = 2;
    }
}

async function invokeCompilerInstance(compiler, lastHash, options, outputOptions, processingMessageBuffer) {
    // eslint-disable-next-line  no-async-promise-executor
    return new Promise(async resolve => {
        await compiler.run(function(err, stats) {
            const content = compilerCallback(compiler, err, stats, lastHash, options, outputOptions, processingMessageBuffer);
            resolve(content);
        });
    });
}

async function invokeWatchInstance(compiler, lastHash, options, outputOptions, watchOptions, processingMessageBuffer) {
    return compiler.watch(watchOptions, function(err, stats) {
        return compilerCallback(compiler, err, stats, lastHash, options, outputOptions, processingMessageBuffer);
    });
}

function getCompiler(options) {
    return webpack(options);
}

async function webpackInstance(opts) {
    const { outputOptions, processingMessageBuffer, options } = opts;
    let compiler;
    try {
        compiler = getCompiler(options);
    } catch (err) {
        process.stdout.write('\n');
        process.cliLogger.error(`${err.name}: ${err.message}`);
        process.stdout.write('\n');
        return;
    }

    const lastHash = null;

    const { ProgressPlugin } = webpack;
    if (options.plugins) {
        options.plugins = options.plugins.filter(e => e instanceof ProgressPlugin);
    }

    if (outputOptions.interactive) {
        const interactive = require('./interactive');
        return interactive(options, outputOptions, processingMessageBuffer);
    }

    if (compiler.compilers) {
        compiler.compilers.forEach((comp, idx) => {
            setUpHookForCompiler(comp, outputOptions, options[idx]);
        });
    } else {
        setUpHookForCompiler(compiler, outputOptions, options);
    }

    if (outputOptions.watch) {
        const watchOptions = outputOptions.watchOptions || {};
        if (watchOptions.stdin) {
            process.stdin.on('end', function() {
                process.exit(); // eslint-disable-line
            });
            process.stdin.resume();
        }
        await invokeWatchInstance(compiler, lastHash, options, outputOptions, watchOptions, processingMessageBuffer);
    } else {
        return await invokeCompilerInstance(compiler, lastHash, options, outputOptions, processingMessageBuffer);
    }
}

module.exports.getCompiler = getCompiler;
module.exports.webpackInstance = webpackInstance;
