import { type Compiler, type cli } from "webpack";
import {
  type IWebpackCLI,
  type StringsKeys,
  WebpackCLICommandOption,
  type WebpackDevServerOptions,
} from "webpack-cli";

const WEBPACK_PACKAGE = process.env.WEBPACK_PACKAGE || "webpack";
const WEBPACK_DEV_SERVER_PACKAGE = process.env.WEBPACK_DEV_SERVER_PACKAGE || "webpack-dev-server";

type Problem = NonNullable<ReturnType<(typeof cli)["processArguments"]>>[0];

class ServeCommand {
  async apply(cli: IWebpackCLI, options: WebpackCLICommandOption[]): Promise<void> {
    const devServer = require(WEBPACK_DEV_SERVER_PACKAGE);

    const devServerFlags = Object.entries(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cli.webpack.cli.getArguments(devServer.schema) as Record<string, any>,
    ).map(([name, option]) => ({ name, ...option, group: "core", hidden: true }));

    await cli.makeCommand({
      name: "serve [entries...]",
      alias: ["server", "s"],
      description: "Run the webpack dev server and watch for source file changes while serving.",
      options: [...options, ...devServerFlags.flatMap(cli.makeOption.bind(cli))],
      dependencies: [WEBPACK_PACKAGE, WEBPACK_DEV_SERVER_PACKAGE],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async action(entries: string[], options: any) {
        const builtInOptions = cli.getBuiltInOptions();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const webpackCLIOptions: Record<string, any> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const devServerCLIOptions: Record<string, any> = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processors: ((opts: Record<string, any>) => void)[] = [];

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
            Promise.all(servers.map((server) => server.stop())).then(() => {
              process.exit(0);
            });
          });
          process.stdin.resume();
        }

        const DevServer = require(WEBPACK_DEV_SERVER_PACKAGE);

        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
          if (compilerForDevServer.options.devServer === false) {
            continue;
          }

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
          const result = { ...compilerForDevServer.options.devServer };
          const problems = cli.webpack.cli.processArguments(args, result, values);

          if (problems) {
            const groupBy = <K extends keyof Problem & StringsKeys<Problem>>(
              xs: Problem[],
              key: K,
            ) =>
              xs.reduce((rv: Record<string, Problem[]>, problem: Problem) => {
                const path = problem[key];

                (rv[path] ||= []).push(problem);

                return rv;
              }, {});

            const problemsByPath = groupBy<"path">(problems, "path");

            for (const path in problemsByPath) {
              const problems = problemsByPath[path];

              for (const problem of problems) {
                cli.logger.error(
                  `${cli.capitalizeFirstLetter(problem.type.replace("-", " "))}${
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

          const devServerOptions: WebpackDevServerOptions = result as WebpackDevServerOptions;

          if (devServerOptions.port) {
            const portNumber = Number(devServerOptions.port);

            if (usedPorts.includes(portNumber)) {
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

        if (servers.length === 0) {
          cli.logger.error("No dev server configurations to run");
          process.exit(2);
        }
      },
    });
  }
}

export default ServeCommand;
