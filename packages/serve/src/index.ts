import { type Compiler, type cli } from "webpack";
import { type IWebpackCLI, type WebpackDevServerOptions } from "webpack-cli";

const WEBPACK_PACKAGE = process.env.WEBPACK_PACKAGE || "webpack";
const WEBPACK_DEV_SERVER_PACKAGE = process.env.WEBPACK_DEV_SERVER_PACKAGE || "webpack-dev-server";

type Problem = NonNullable<ReturnType<(typeof cli)["processArguments"]>>[0];

class ServeCommand {
  async apply(cli: IWebpackCLI): Promise<void> {
    const loadDevServerOptions = () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const devServer = require(WEBPACK_DEV_SERVER_PACKAGE);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: Record<string, any> = cli.webpack.cli.getArguments(devServer.schema);

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
        description: "Run the webpack dev server and watch for source file changes while serving.",
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

        const builtInOptions = cli.getBuiltInOptions();

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        webpackCLIOptions.isWatchingLikeCommand = true;

        const compiler = await cli.createCompiler(webpackCLIOptions);

        if (!compiler) {
          return;
        }

        const servers: (typeof DevServer)[] = [];

        if (cli.needWatchStdin(compiler)) {
          process.stdin.on("end", () => {
            Promise.all(
              servers.map((server) => {
                return server.stop();
              }),
            ).then(() => {
              process.exit(0);
            });
          });
          process.stdin.resume();
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const DevServer = require(WEBPACK_DEV_SERVER_PACKAGE);

        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require(`${WEBPACK_DEV_SERVER_PACKAGE}/package.json`).version;
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
        const usedPorts: number[] = [];

        for (const compilerForDevServer of compilersForDevServer) {
          let devServerOptions: devServerOptionsType | false;

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

              for (const problem of problems) {
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
              }
            }

            process.exit(2);
          }

          if (devServerOptions === false) {
            continue;
          }

          // TODO remove in the next major release
          if (!isDevServer4) {
            const getPublicPathOption = (): string => {
              const normalizePublicPath = (publicPath): string =>
                typeof publicPath === "undefined" || publicPath === "auto" ? "/" : publicPath;

              if (options.outputPublicPath) {
                return normalizePublicPath(compilerForDevServer.options.output.publicPath);
              }

              if (devServerOptions !== false && devServerOptions.publicPath) {
                return normalizePublicPath(devServerOptions.publicPath);
              }

              return normalizePublicPath(compilerForDevServer.options.output.publicPath);
            };
            const getStatsOption = (): string | boolean => {
              if (options.stats) {
                return options.stats;
              }

              if (devServerOptions !== false && devServerOptions.stats) {
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
            const server = new DevServer(devServerOptions, compiler);

            await server.start();

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
