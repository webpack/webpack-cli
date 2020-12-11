import startDevServer from './startDevServer';

class ServeCommand {
    async apply(cli): Promise<void> {
        const { logger, utils } = cli;
        const isPackageExist = utils.getPkg('webpack-dev-server');

        if (!isPackageExist) {
            try {
                await utils.promptInstallation('webpack-dev-server', () => {
                    // TODO colors
                    logger.error("For using this command you need to install: 'webpack-dev-server' package");
                });
            } catch (error) {
                logger.error("Action Interrupted, use 'webpack-cli help' to see possible commands.");
                process.exit(2);
            }
        }

        let devServerFlags = [];

        try {
            // eslint-disable-next-line node/no-extraneous-require
            require('webpack-dev-server');
            // eslint-disable-next-line node/no-extraneous-require
            devServerFlags = require('webpack-dev-server/bin/cli-flags').devServer;
        } catch (err) {
            logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
            process.exit(2);
        }

        const builtInOptions = cli.getBuiltInOptions();

        cli.makeCommand(
            {
                name: 'serve',
                alias: 's',
                description: 'Run the webpack dev server',
                usage: '[options]',
                pkg: '@webpack-cli/serve',
            },
            [...builtInOptions, ...devServerFlags],
            async (program) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const webpackOptions: Record<string, any> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const devServerOptions: Record<string, any> = {};
                const options = program.opts();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const processors: Array<(opts: Record<string, any>) => void> = [];

                for (const optionName in options) {
                    if (optionName === 'hot' || optionName === 'progress') {
                        devServerOptions[optionName] = options[optionName];
                        webpackOptions[optionName] = options[optionName];
                    } else {
                        const kebabedOption = cli.utils.toKebabCase(optionName);
                        const isBuiltInOption = builtInOptions.find((builtInOption) => builtInOption.name === kebabedOption);

                        if (isBuiltInOption) {
                            webpackOptions[optionName] = options[optionName];
                        } else {
                            const needToProcess = devServerFlags.find(
                                (devServerOption) => devServerOption.name === kebabedOption && devServerOption.processor,
                            );

                            if (needToProcess) {
                                processors.push(needToProcess.processor);
                            }

                            devServerOptions[optionName] = options[optionName];
                        }
                    }
                }

                for (const processor of processors) {
                    processor(devServerOptions);
                }

                webpackOptions.env = { WEBPACK_SERVE: true, ...options.env };

                const compiler = await cli.createCompiler(webpackOptions);

                try {
                    await startDevServer(compiler, devServerOptions, logger);
                } catch (error) {
                    if (error.name === 'ValidationError') {
                        logger.error(error.message);
                    } else {
                        logger.error(error);
                    }

                    process.exit(2);
                }
            },
        );
    }
}

export default ServeCommand;
