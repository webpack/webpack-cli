// eslint-disable-next-line node/no-extraneous-import
import type { Compiler, cli } from "webpack";
import { IWebpackCLI, WebpackDevServerOptions } from "webpack-cli";

const WEBPACK_PACKAGE = process.env.WEBPACK_PACKAGE || "webpack";
const WEBPACK_DEV_SERVER_PACKAGE = process.env.WEBPACK_DEV_SERVER_PACKAGE || "webpack-dev-server";

type Problem = NonNullable<ReturnType<typeof cli["processArguments"]>>[0];
type PublicPath = WebpackDevServerOptions["output"]["publicPath"];
class ServeCommand {
  async apply(cli: IWebpackCLI): Promise<void> {
    const loadDevServerOptions = () => {
      // TODO simplify this after drop webpack v4 and webpack-dev-server v3
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const devServer = require(WEBPACK_DEV_SERVER_PACKAGE);
      const isNewDevServerCLIAPI = typeof devServer.schema !== "undefined";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let options: Record<string, any> = {};

      if (isNewDevServerCLIAPI) {
        if (cli.webpack.cli && typeof cli.webpack.cli.getArguments === "function") {
          options = cli.webpack.cli.getArguments(devServer.schema);
        } else {
          options = devServer.cli.getArguments();
        }
      } else {
        options = require(`${WEBPACK_DEV_SERVER_PACKAGE}/bin/cli-flags`);
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
        dependencies: [WEBPACK_PACKAGE, WEBPACK_DEV_SERVER_PACKAGE],
      },
      async () => {
        let devServerFlags = [];

        cli.webpack = await cli.loadWebpack();

        try {
          devServerFlags = loadDevServerOptions();
        } catch (error) {
          cli.logger.error(
            `You need to install 'webpack-dev-server' for running 'webpack serve'.\n${error}`,
          );
          process.exit(2);
        }

        const builtInOptions = cli.getBuiltInOptions().filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (option: any) => option.name !== "watch",
        );

        return [...builtInOptions, ...devServerFlags];
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (entries: string[], options: any) => {
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
          const kebabedOption = cli.toKebabCase(optionName);
           
          const isBuiltInOption = builtInOptions.find(
            (builtInOption: any) => builtInOption.name === kebabedOption,
          );

          if (isBuiltInOption) {
            webpackCLIOptions[optionName] = options[optionName];
          } else {
            const needToProcess = devServerFlags.find(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (devServerOption: any) =>
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

        const servers: typeof DevServer[] = [];

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
                if (typeof server.stop === "function") {
                  return server.stop();
                }

                // TODO remove in the next major release
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

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const DevServer = require(WEBPACK_DEV_SERVER_PACKAGE);
        const isNewDevServerCLIAPI = typeof DevServer.schema !== "undefined";

        let devServerVersion;

        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          devServerVersion = require(`${WEBPACK_DEV_SERVER_PACKAGE}/package.json`).version;
        } catch (err) {
          cli.logger.error(
            `You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`,
          );
          process.exit(2);
        }

        const compilers = cli.isMultipleCompiler(compiler) ? compiler.compilers : [compiler];
        const possibleCompilers = compilers.filter(
          (compiler: Compiler) => compiler.options.devServer,
        );
        const compilersForDevServer =
          possibleCompilers.length > 0 ? possibleCompilers : [compilers[0]];
        const isDevServer4 = devServerVersion.startsWith("4");
        const usedPorts: number[] = [];

        for (const compilerForDevServer of compilersForDevServer) {
          let devServerOptions: WebpackDevServerOptions;

          if (isNewDevServerCLIAPI) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const args = devServerFlags.reduce((accumulator: Record<string, any>, flag: any) => {
              accumulator[flag.name] = flag;

              return accumulator;
            }, {});
            const values = Object.keys(devServerCLIOptions).reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (accumulator: Record<string, any>, name: string) => {
                const kebabName = cli.toKebabCase(name);

                if (args[kebabName]) {
                  accumulator[kebabName] = options[name];
                }

                return accumulator;
              },
              {},
            );
            const result = { ...(compilerForDevServer.options.devServer || {}) };
            const problems = (
              cli.webpack.cli && typeof cli.webpack.cli.processArguments === "function"
                ? cli.webpack.cli
                : DevServer.cli
            ).processArguments(args, result, values);

            if (problems) {
              const groupBy = (xs: Problem[], key: keyof Problem) => {
                return xs.reduce((rv: { [key: string]: Problem[] }, x: Problem) => {
                  (rv[x[key]] = rv[x[key]] || []).push(x);

                  return rv;
                }, {});
              };

              const problemsByPath = groupBy(problems, "path");

              for (const path in problemsByPath) {
                const problems = problemsByPath[path];

                problems.forEach((problem: Problem) => {
                  cli.logger.error(
                    `${cli.capitalizeFirstLetter(problem.type.replace(/-/g, " "))}${
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

            devServerOptions = result as WebpackDevServerOptions;
          } else {
            // TODO remove in the next major release
            const mergeOptions = (
              devServerOptions: Partial<WebpackDevServerOptions>,
              devServerCliOptions: Partial<WebpackDevServerOptions>,
            ): WebpackDevServerOptions => {
              // CLI options should take precedence over devServer options,
              // and CLI options should have no default values included
              const options = { ...devServerOptions, ...devServerCliOptions };

              if (
                devServerOptions.client &&
                devServerCliOptions.client &&
                typeof devServerOptions.client === "object" &&
                typeof devServerCliOptions.client === "object"
              ) {
                // the user could set some client options in their devServer config,
                // then also specify client options on the CLI
                options.client = {
                  ...devServerOptions.client,
                  ...devServerCliOptions.client,
                };
              }

              return options as WebpackDevServerOptions;
            };

            devServerOptions = mergeOptions(
              compilerForDevServer.options.devServer || {},
              devServerCLIOptions,
            );
          }

          // TODO remove in the next major release
          if (!isDevServer4) {
            const getPublicPathOption = (): PublicPath => {
              const normalizePublicPath = (publicPath: PublicPath): PublicPath =>
                typeof publicPath === "undefined" || publicPath === "auto" ? "/" : publicPath;

              if (options.outputPublicPath) {
                return normalizePublicPath(compilerForDevServer.options.output.publicPath);
              }

              if (devServerOptions.publicPath) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                return normalizePublicPath(devServerOptions.publicPath);
              }

              return normalizePublicPath(compilerForDevServer.options.output.publicPath);
            };
            const getStatsOption = (): WebpackDevServerOptions["stats"] => {
              if (options.stats) {
                return options.stats;
              }

              if (devServerOptions.stats) {
                return devServerOptions.stats;
              }

              return compilerForDevServer.options.stats;
            };

            devServerOptions.host = devServerOptions.host || "localhost";
            devServerOptions.port =
              typeof devServerOptions.port !== "undefined" ? devServerOptions.port : 8080;
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
            let server;

            // TODO: remove after dropping webpack-dev-server@v3
            if (isDevServer4) {
              server = new DevServer(devServerOptions, compiler);
            } else {
              server = new DevServer(compiler, devServerOptions);
            }

            if (typeof server.start === "function") {
              await server.start();
            } else {
              // TODO remove in the next major release
              server.listen(devServerOptions.port, devServerOptions.host, (error: Error): void => {
                if (error) {
                  throw error;
                }
              });
            }

            servers.push(server);
          } catch (error) {
            if (cli.isValidationError(error as Error)) {
              cli.logger.error((error as Error).message);
            } else {
              cli.logger.error(error);
            }

            process.exit(2);
          }
        }
      },
    );
  }
}

export default ServeCommand;
