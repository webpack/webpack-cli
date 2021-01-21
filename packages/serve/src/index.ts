import startDevServer from './startDevServer';

class ServeCommand {
    async apply(cli): Promise<void> {
        const { logger } = cli;

        await cli.makeCommand(
            {
                name: 'serve [entries...]',
                alias: 's',
                description: 'Run the webpack dev server.',
                usage: '[options]',
                pkg: '@webpack-cli/serve',
                dependencies: ['webpack-dev-server'],
            },
            () => {
                let devServerFlags = [];

                try {
                    // eslint-disable-next-line
                    devServerFlags = require('webpack-dev-server/bin/cli-flags').devServer;
                } catch (error) {
                    logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${error}`);
                    process.exit(2);
                }

                const builtInOptions = cli.getBuiltInOptions();

                return [...builtInOptions, ...devServerFlags];
            },
            async (entries, options) => {
                const builtInOptions = cli.getBuiltInOptions();
                let devServerFlags = [];

                try {
                    // eslint-disable-next-line
                    devServerFlags = require('webpack-dev-server/bin/cli-flags').devServer;
                } catch (error) {
                    // Nothing, to prevent future updates
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const webpackOptions: Record<string, any> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const devServerOptions: Record<string, any> = {};

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const processors: Array<(opts: Record<string, any>) => void> = [];

                for (const optionName in options) {
                    const kebabedOption = cli.utils.toKebabCase(optionName);
                    // `webpack-dev-server` has own logic for the `--hot` option
                    const isBuiltInOption =
                        kebabedOption !== 'hot' && builtInOptions.find((builtInOption) => builtInOption.name === kebabedOption);

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

                for (const processor of processors) {
                    processor(devServerOptions);
                }

                if (entries.length > 0) {
                    webpackOptions.entry = [...entries, ...(webpackOptions.entry || [])];
                }

                webpackOptions.argv = { ...options, env: { WEBPACK_SERVE: true, ...options.env } };

                const compiler = await cli.createCompiler(webpackOptions);

                if (!compiler) {
                    return;
                }

                let servers;

                if (cli.needWatchStdin(compiler) || devServerOptions.stdin) {
                    // TODO remove in the next major release
                    // Compatibility with old `stdin` option for `webpack-dev-server`
                    // Should be removed for the next major release on both sides
                    if (devServerOptions.stdin) {
                        delete devServerOptions.stdin;
                    }

                    process.stdin.on('end', () => {
                        Promise.all(
                            servers.map((server) => {
                                return new Promise<void>((resolve) => {
                                    server.close(() => {
                                        resolve();
                                    });
                                });
                            }),
                        ).then(() => {
                            process.exit(0);
                        });
                    });
                    process.stdin.resume();
                }

                try {
                    servers = await startDevServer(compiler, devServerOptions, options, logger);
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
