import startDevServer from "./startDevServer";

class ServeCommand {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async apply(cli: any): Promise<void> {
        const { logger, webpack } = cli;

        const loadDevServerOptions = () => {
            // TODO simplify this after drop webpack v4 and webpack-dev-server v3
            // eslint-disable-next-line @typescript-eslint/no-var-requires, node/no-extraneous-require
            const devServer = require("webpack-dev-server");
            const isNewDevServerCLIAPI = typeof devServer.schema !== "undefined";

            let options = {};

            if (isNewDevServerCLIAPI) {
                if (webpack.cli && typeof webpack.cli.getArguments === "function") {
                    options = webpack.cli.getArguments(devServer.schema);
                } else {
                    options = devServer.cli.getArguments();
                }
            } else {
                // eslint-disable-next-line node/no-extraneous-require
                options = require("webpack-dev-server/bin/cli-flags");
            }

            // Old options format
            // { devServer: [{...}, {}...] }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (options.devServer) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
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
                const isNewDevServerCLIAPI = typeof devServer.schema !== "undefined";

                if (isNewDevServerCLIAPI) {
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
                    const result = Object.assign({}, compiler.options.devServer);
                    const problems = (
                        webpack.cli && typeof webpack.cli.processArguments === "function"
                            ? webpack.cli
                            : devServer.cli
                    ).processArguments(args, result, values);

                    if (problems) {
                        const groupBy = (xs, key) => {
                            return xs.reduce((rv, x) => {
                                (rv[x[key]] = rv[x[key]] || []).push(x);

                                return rv;
                            }, {});
                        };

                        const problemsByPath = groupBy(problems, "path");

                        for (const path in problemsByPath) {
                            const problems = problemsByPath[path];
                            problems.forEach((problem) => {
                                cli.logger.error(
                                    `${cli.utils.capitalizeFirstLetter(
                                        problem.type.replace(/-/g, " "),
                                    )}${problem.value ? ` '${problem.value}'` : ""} for the '--${
                                        problem.argument
                                    }' option${
                                        problem.index ? ` by index '${problem.index}'` : ""
                                    }`,
                                );

                                if (problem.expected) {
                                    cli.logger.error(`Expected: '${problem.expected}'`);
                                }
                            });
                        }

                        process.exit(2);
                    }

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
