const packageExists = require('../utils/package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const logger = require('../utils/logger');

class CLIPlugin {
    constructor(options) {
        this.options = options;
    }

    setupHotPlugin(compiler) {
        const { HotModuleReplacementPlugin } = compiler.webpack || webpack;
        const hotModuleReplacementPlugin = Boolean(compiler.options.plugins.find((plugin) => plugin instanceof HotModuleReplacementPlugin));

        if (!hotModuleReplacementPlugin) {
            new HotModuleReplacementPlugin().apply(compiler);
        }
    }

    setupPrefetchPlugin(compiler) {
        const { PrefetchPlugin } = compiler.webpack || webpack;

        new PrefetchPlugin(null, this.options.prefetch).apply(compiler);
    }

    async setupBundleAnalyzerPlugin(compiler) {
        // eslint-disable-next-line node/no-extraneous-require
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        const bundleAnalyzerPlugin = Boolean(compiler.options.plugins.find((plugin) => plugin instanceof BundleAnalyzerPlugin));

        if (!bundleAnalyzerPlugin) {
            new BundleAnalyzerPlugin().apply(compiler);
        }
    }

    setupProgressPlugin(compiler) {
        const { ProgressPlugin } = compiler.webpack || webpack;
        const progressPlugin = Boolean(compiler.options.plugins.find((plugin) => plugin instanceof ProgressPlugin));

        if (!progressPlugin) {
            if (typeof this.options.progress === 'string' && this.options.progress !== 'profile') {
                logger.error(`'${this.options.progress}' is an invalid value for the --progress option. Only 'profile' is allowed.`);
                process.exit(2);
            }

            new ProgressPlugin({ profile: this.options.progress === 'profile' }).apply(compiler);
        }
    }

    setupHelpfulOutput(compiler) {
        const pluginName = 'webpack-cli';
        const getCompilationName = (compilation) => (compilation.name ? ` '${compilation.name}'` : '');

        compiler.hooks.run.tap(pluginName, (compiler) => {
            logger.success(`Compilation${getCompilationName(compiler)} starting...`);
        });

        compiler.hooks.watchRun.tap(pluginName, (compiler) => {
            const { bail, watch } = compiler.options;

            if (bail && watch) {
                logger.warn('You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.');
            }

            logger.success(`Compilation${getCompilationName(compiler)} starting...`);
        });

        compiler.hooks.invalid.tap(pluginName, (filename, changeTime) => {
            const date = new Date(changeTime * 1000);

            logger.log(`File '${filename}' was modified, changed time is ${date} (timestamp is ${changeTime})`);
        });

        (compiler.webpack ? compiler.hooks.afterDone : compiler.hooks.done).tap(pluginName, (stats) => {
            logger.success(`Compilation${getCompilationName(stats.compilation)} finished`);

            process.nextTick(() => {
                if (compiler.watchMode) {
                    logger.success(`Compiler${getCompilationName(stats.compilation)} is watching files for updates...`);
                }
            });
        });
    }

    apply(compiler) {
        if (this.options.progress && this.options.helpfulOutput) {
            this.setupProgressPlugin(compiler);
        }

        if (this.options.hot) {
            this.setupHotPlugin(compiler);
        }

        if (this.options.prefetch) {
            this.setupPrefetchPlugin(compiler);
        }

        if (this.options.analyze) {
            this.setupBundleAnalyzerPlugin(compiler);
        }

        if (this.options.helpfulOutput) {
            this.setupHelpfulOutput(compiler);
        }
    }
}

module.exports = CLIPlugin;
