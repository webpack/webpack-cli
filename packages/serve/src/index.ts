import startDevServer from "./startDevServer";

class ServeCommand {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async apply(cli: any): Promise<void> {
        const { logger, webpack } = cli;

        const loadDevServerOptions = () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-extraneous-require
            const devServer = require("webpack-dev-server");

            // TODO only keep `getArguments` after drop webpack v4

            const options =
                typeof devServer.getArguments === "function"
                    ? devServer.getArguments(webpack)
                    : // eslint-disable-next-line node/no-extraneous-require
                      require("webpack-dev-server/bin/cli-flags");

            // Old options format
            // { devServer: [{...}, {}...] }
            if (options.devServer) {
                return options.devServer;
            }

            // New options format
            // { flag1: {}, flag2: {} }
            return Object.keys(options).map((key) => {
                options[key].name = key;

                return options[key];
            });
        };

        await cli.makeCommand(
            {
                name: "serve [entries...]",
                alias: ["server", "s"],
                description: "Run the webpack dev server.",
                usage: "[entries...] [options]",
                pkg: "@webpack-cli/serve",
                dependencies: ["webpack-dev-server"],
            },
            () => {
                let devServerFlags = [];

                try {
                    devServerFlags = loadDevServerOptions();
                } catch (error) {
                    logger.error(
                        `You need to install 'webpack-dev-server' for running 'webpack serve'.\n${error}`,
                    );
                    process.exit(2);
                }

                const builtInOptions = cli
                    .getBuiltInOptions()
                    .filter((option) => option.name !== "watch");

                return [...builtInOptions, ...devServerFlags];
            },
            async (entries, options) => {
                const builtInOptions = cli.getBuiltInOptions();
                let devServerFlags = [];

                try {
                    devServerFlags = loadDevServerOptions();
                } catch (error) {
                    // Nothing, to prevent future updates
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const webpackOptions: Record<string, any> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let devServerOptions: Record<string, any> = {};

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const processors: Array<(opts: Record<string, any>) => void> = [];

                for (const optionName in options) {
                    const kebabedOption = cli.utils.toKebabCase(optionName);
                    // `webpack-dev-server` has own logic for the `--hot` option
                    const isBuiltInOption =
                        kebabedOption !== "hot" &&
                        builtInOptions.find(
                            (builtInOption) => builtInOption.name === kebabedOption,
                        );

                    if (isBuiltInOption) {
                        webpackOptions[optionName] = options[optionName];
                    } else {
                        const needToProcess = devServerFlags.find(
                            (devServerOption) =>
                                devServerOption.name === kebabedOption && devServerOption.processor,
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

                webpackOptions.argv = {
                    ...options,
                    env: { WEBPACK_SERVE: true, ...options.env },
                };

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

                    process.stdin.on("end", () => {
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

                // eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-extraneous-require
                const devServer = require("webpack-dev-server");

                if (typeof devServer.processArguments === "function") {
                    const args = devServerFlags.reduce((accumulator, flag) => {
                        accumulator[flag.name] = flag;

                        return accumulator;
                    }, {});
                    const values = Object.keys(devServerOptions).reduce((accumulator, name) => {
                        const kebabName = cli.utils.toKebabCase(name);

                        if (args[kebabName]) {
                            accumulator[kebabName] = options[name];
                        }

                        return accumulator;
                    }, {});
                    const result = { ...compiler.options.devServer };

                    devServer.processArguments(cli.webpack, args, result, values);
                    devServerOptions = result;
                }

                try {
                    servers = await startDevServer(compiler, devServerOptions, options, logger);
                } catch (error) {
                    if (cli.isValidationError(error)) {
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
