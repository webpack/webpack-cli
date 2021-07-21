/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */
import { devServerOptionsType } from "./types";

/**
 *
 * Starts the devServer
 *
 * @param {Object} compiler - a webpack compiler
 * @param {Object} devServerCliOptions - dev server CLI options
 * @param {Object} cliOptions - CLI options
 * @param {Object} logger - logger
 *
 * @returns {Object[]} array of resulting servers
 */

export default async function startDevServer(
    compiler: any,
    devServerCliOptions: any,
    cliOptions: any,
    logger: any,
): Promise<Record<string, unknown>[]> {
    let devServerVersion, Server;

    try {
        // eslint-disable-next-line node/no-extraneous-require
        devServerVersion = require("webpack-dev-server/package.json").version;
        // eslint-disable-next-line node/no-extraneous-require
        Server = require("webpack-dev-server");
    } catch (err) {
        logger.error(
            `You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`,
        );
        process.exit(2);
    }

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

    const isMultiCompiler = Boolean(compiler.compilers);

    let compilersWithDevServerOption;

    if (isMultiCompiler) {
        compilersWithDevServerOption = compiler.compilers.filter(
            (compiler) => compiler.options.devServer,
        );

        // No compilers found with the `devServer` option, let's use first compiler
        if (compilersWithDevServerOption.length === 0) {
            compilersWithDevServerOption = [compiler.compilers[0]];
        }
    } else {
        compilersWithDevServerOption = [compiler];
    }

    const isDevServer4 = devServerVersion.startsWith("4");
    const usedPorts = [];
    const devServersOptions = [];

    for (const compilerWithDevServerOption of compilersWithDevServerOption) {
        const devServerOptions = mergeOptions(
            compilerWithDevServerOption.options.devServer || {},
            devServerCliOptions,
        );

        if (!isDevServer4) {
            const getPublicPathOption = (): string => {
                const normalizePublicPath = (publicPath): string =>
                    typeof publicPath === "undefined" || publicPath === "auto" ? "/" : publicPath;

                if (cliOptions.outputPublicPath) {
                    return normalizePublicPath(
                        compilerWithDevServerOption.options.output.publicPath,
                    );
                }

                // webpack-dev-server@3
                if (devServerOptions.publicPath) {
                    return normalizePublicPath(devServerOptions.publicPath);
                }

                return normalizePublicPath(compilerWithDevServerOption.options.output.publicPath);
            };
            const getStatsOption = (): string | boolean => {
                if (cliOptions.stats) {
                    return compilerWithDevServerOption.options.stats;
                }

                if (devServerOptions.stats) {
                    return devServerOptions.stats;
                }

                return compilerWithDevServerOption.options.stats;
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

        devServersOptions.push({ compiler, options: devServerOptions });
    }

    const servers = [];

    for (const devServerOptions of devServersOptions) {
        const { compiler, options } = devServerOptions;
        const server = new Server(compiler, options);

        server.listen(options.port, options.host, (error): void => {
            if (error) {
                throw error;
            }
        });

        servers.push(server);
    }

    return servers;
}
