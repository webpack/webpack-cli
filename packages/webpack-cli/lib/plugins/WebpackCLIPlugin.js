const { packageExists } = require('../utils/package-exists');
const webpack = packageExists('webpack') ? require('webpack') : undefined;
const logger = require('../utils/logger');

const PluginName = 'webpack-cli';

class WebpackCLIPlugin {
    constructor(options) {
        this.options = options;
    }
    async apply(compiler) {
        const compilers = compiler.compilers ? compiler.compilers : [compiler];

        for (const compiler of compilers) {
            if (this.options.progress) {
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

        compiler.hooks.watchRun.tap(PluginName, (compilation) => {
            const { bail, watch } = compilation.options;
            if (bail && watch) {
                logger.warn('You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.');
            }

            logger.success(`Compilation${compilation.name ? `${compilation.name}` : ''} starting...`);
        });
        compiler.hooks.done.tap(PluginName, (compilation) => {
            logger.success(`Compilation${compilation.name ? `${compilation.name}` : ''} finished`);
        });
    }
}

module.exports = WebpackCLIPlugin;
