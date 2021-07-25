import { devServerOptionsType } from "./types";

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
                const webpackCLIOptions: Record<string, any> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const devServerCLIOptions: Record<string, any> = {};

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const processors: Array<(opts: Record<string, any>) => void> = [];

                for (const optionName in options) {
                    const kebabedOption = cli.utils.toKebabCase(optionName);
                    const isBuiltInOption = builtInOptions.find(
                        (builtInOption) => builtInOption.name === kebabedOption,
                    );

                    if (isBuiltInOption) {
                        webpackCLIOptions[optionName] = options[optionName];
                    } else {
                        const needToProcess = devServerFlags.find(
                            (devServerOption) =>
                                devServerOption.name === kebabedOption && devServerOption.processor,
                        );

                        if (needToProcess) {
                            processors.push(needToProcess.processor);
                        }

                        devServerCLIOptions[optionName] = options[optionName];
                    }
                }

                for (const processor of processors) {
                    processor(devServerCLIOptions);
                }

                if (entries.length > 0) {
                    webpackCLIOptions.entry = [...entries, ...(webpackCLIOptions.entry || [])];
                }

                webpackCLIOptions.argv = {
                    ...options,
                    env: { WEBPACK_SERVE: true, ...options.env },
                };

                const compiler = await cli.createCompiler(webpackCLIOptions);

                if (!compiler) {
                    return;
                }

                const servers = [];

                if (cli.needWatchStdin(compiler) || devServerCLIOptions.stdin) {
                    // TODO remove in the next major release
                    // Compatibility with old `stdin` option for `webpack-dev-server`
                    // Should be removed for the next major release on both sides
                    if (devServerCLIOptions.stdin) {
                        delete devServerCLIOptions.stdin;
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
                const DevServer = require("webpack-dev-server");
                const isNewDevServerCLIAPI = typeof DevServer.schema !== "undefined";

                let devServerVersion;

                try {
                    // eslint-disable-next-line node/no-extraneous-require, @typescript-eslint/no-var-requires
                    devServerVersion = require("webpack-dev-server/package.json").version;
                } catch (err) {
                    logger.error(
                        `You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`,
                    );
                    process.exit(2);
                }

                const compilers =
                    typeof compiler.compilers !== "undefined" ? compiler.compilers : [compiler];
                const possibleCompilers = compilers.filter(
                    (compiler) => compiler.options.devServer,
                );
                const compilersForDevServer =
                    possibleCompilers.length > 0 ? possibleCompilers : [compilers[0]];
                const isDevServer4 = devServerVersion.startsWith("4");
                const usedPorts = [];

                for (const compilerForDevServer of compilersForDevServer) {
                    let devServerOptions: devServerOptionsType;

                    if (isNewDevServerCLIAPI) {
                        const args = devServerFlags.reduce((accumulator, flag) => {
                            accumulator[flag.name] = flag;
                            return accumulator;
                        }, {});
                        const values = Object.keys(devServerCLIOptions).reduce(
                            (accumulator, name) => {
                                const kebabName = cli.utils.toKebabCase(name);
                                if (args[kebabName]) {
                                    accumulator[kebabName] = options[name];
                                }
                                return accumulator;
                            },
                            {},
                        );
                        const result = { ...(compilerForDevServer.options.devServer || {}) };
                        const problems = (
                            webpack.cli && typeof webpack.cli.processArguments === "function"
                                ? webpack.cli
                                : DevServer.cli
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
                                        )}${
                                            problem.value ? ` '${problem.value}'` : ""
                                        } for the '--${problem.argument}' option${
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
                    } else {
                        // TODO remove in the next major release
                        const mergeOptions = (
                            devServerOptions: devServerOptionsType,
                            devServerCliOptions: devServerOptionsType,
                        ): devServerOptionsType => {
                            // CLI options should take precedence over devServer options,
                            // and CLI options should have no default values included
                            const options = { ...devServerOptions, ...devServerCliOptions };

                            if (devServerOptions.client && devServerCliOptions.client) {
                                // the user could set some client options in their devServer config,
                                // then also specify client options on the CLI
                                options.client = {
                                    ...devServerOptions.client,
                                    ...devServerCliOptions.client,
                                };
                            }

                            return options;
                        };

                        devServerOptions = mergeOptions(
                            compilerForDevServer.options.devServer || {},
                            devServerCLIOptions,
                        );
                    }

                    // TODO remove in the next major release
                    if (!isDevServer4) {
                        const getPublicPathOption = (): string => {
                            const normalizePublicPath = (publicPath): string =>
                                typeof publicPath === "undefined" || publicPath === "auto"
                                    ? "/"
                                    : publicPath;

                            if (options.outputPublicPath) {
                                return normalizePublicPath(
                                    compilerForDevServer.options.output.publicPath,
                                );
                            }

                            if (devServerOptions.publicPath) {
                                return normalizePublicPath(devServerOptions.publicPath);
                            }

                            return normalizePublicPath(
                                compilerForDevServer.options.output.publicPath,
                            );
                        };
                        const getStatsOption = (): string | boolean => {
                            if (options.stats) {
                                return options.stats;
                            }

                            if (devServerOptions.stats) {
                                return devServerOptions.stats;
                            }

                            return compilerForDevServer.options.stats;
                        };

                        devServerOptions.host = devServerOptions.host || "localhost";
                        devServerOptions.port = devServerOptions.port || 8080;
                        devServerOptions.stats = getStatsOption();
                        devServerOptions.publicPath = getPublicPathOption();
                    }

                    if (devServerOptions.port) {
                        const portNumber = Number(devServerOptions.port);

                        if (usedPorts.find((port) => portNumber === port)) {
                            throw new Error(
                                "Unique ports must be specified for each devServer option in your webpack configuration. Alternatively, run only 1 devServer config using the --config-name flag to specify your desired config.",
                            );
                        }

                        usedPorts.push(portNumber);
                    }

                    try {
                        const server = new DevServer(compiler, devServerOptions);

                        server.listen(
                            devServerOptions.port,
                            devServerOptions.host,
                            (error): void => {
                                if (error) {
                                    throw error;
                                }
                            },
                        );

                        servers.push(server);
                    } catch (error) {
                        if (cli.isValidationError(error)) {
                            logger.error(error.message);
                        } else {
                            logger.error(error);
                        }

                        process.exit(2);
                    }
                }
            },
        );
    }
}

export default ServeCommand;
