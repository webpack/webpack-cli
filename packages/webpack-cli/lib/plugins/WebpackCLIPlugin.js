const packageExists = require('../utils/package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const { getStatsOptions } = require('../utils/stats-options');
const { PluginName } = require('../utils/name');

class WebpackCLIPlugin {
    constructor(options) {
        this.options = options;

        this.isWatch = false;
    }

    async apply(compiler) {
        const { progress } = this.options;
        if (progress) {
            this.appendProgressPlugin(compiler, progress);
        }

        const isWebpack5 = Boolean(compiler.webpack);

        const logger = compiler.getInfrastructureLogger(PluginName);

        const resolveName = (obj) => (obj.name ? `${obj.name} ` : '');

        const done = (stats) => {
            const printStats = (childCompiler, childStats) => {
                const name = resolveName(childCompiler);

                const status = childStats.toString({
                    all: false,
                    version: true,
                    timings: true,
                });

                const normalizedStatus = (() => {
                    if (isWebpack5) {
                        return status;
                    } else {
                        const [version, time] = status.split('\n').map((line) => {
                            const value = line.split(':')[1] || '';
                            return value.trim();
                        });

                        return `${name ? name + `(${version})` : version} compiled in ${time}`;
                    }
                })();

                if (childStats.hasErrors()) {
                    logger.error(normalizedStatus);
                } else if (childStats.hasWarnings()) {
                    logger.warn(normalizedStatus);
                } else {
                    logger.info(normalizedStatus);
                }

                const statsString = childStats.toString(getStatsOptions(childCompiler));
                process.stdout.write(statsString + '\n');

                if (this.isWatch) {
                    logger.info(name + 'watching files for updates...');
                }
            };

            if (compiler.compilers) {
                compiler.compilers.forEach((compilerFromMultiCompileMode, index) => {
                    printStats(compilerFromMultiCompileMode, stats.stats[index]);
                });
            } else {
                printStats(compiler, stats);
            }
        };

        compiler.hooks.run.tap(PluginName, (compilation) => {
            logger.info(resolveName(compilation) + 'compilation starting...');
        });
        compiler.hooks.watchRun.tap(PluginName, (compilation) => {
            logger.info(resolveName(compilation) + 'compilation starting...');

            if (compilation.options.bail) {
                logger.warn('you are using "bail" with "watch". "bail" will still exit webpack when the first error is found.');
            }
            this.isWatch = true;
        });
        compiler.hooks.done.tap(PluginName, (stats) => {
            process.nextTick(() => {
                done(stats);
            });
        });
    }

    appendProgressPlugin(compiler, progress) {
        const { ProgressPlugin } = compiler.webpack || webpack;

        const logger = compiler.getInfrastructureLogger(PluginName);

        const compilers = compiler.compilers || [compiler];

        for (const compiler of compilers) {
            let progressPluginExists;

            if (compiler.options.plugins) {
                progressPluginExists = Boolean(compiler.options.plugins.find((plugin) => plugin instanceof ProgressPlugin));
            }

            if (!progressPluginExists) {
                if (typeof progress === 'string' && progress !== 'profile') {
                    logger.error(`'${progress}' is an invalid value for the --progress option. Only 'profile' is allowed.`);

                    process.exit(2);
                }

                const isProfile = progress === 'profile';

                new ProgressPlugin({ profile: isProfile }).apply(compiler);
            }
        }
    }
}

module.exports = WebpackCLIPlugin;
