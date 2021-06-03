/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-var-requires */

import { chmod, unlinkSync } from "fs";
import net from "net";
import os from "os";
import { resolve } from "path";

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
        const options = mergeOptions(
            compilerWithDevServerOption.options.devServer || {},
            devServerCliOptions,
        );

        if (cliOptions.unixSocket) {
            if (typeof cliOptions.unixSocket === "boolean") {
                cliOptions.unixSocket = resolve(os.tmpdir(), "webpack-dev-server");
            }
        }

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
                if (options.publicPath) {
                    return normalizePublicPath(options.publicPath);
                }

                return normalizePublicPath(compilerWithDevServerOption.options.output.publicPath);
            };
            const getStatsOption = (): string | boolean => {
                if (cliOptions.stats) {
                    return compilerWithDevServerOption.options.stats;
                }

                if (options.stats) {
                    return options.stats;
                }

                return compilerWithDevServerOption.options.stats;
            };

            options.host = options.host || "localhost";
            options.port = options.port || 8080;
            options.stats = getStatsOption();
            options.publicPath = getPublicPathOption();
            options.socket = options.socket || cliOptions.unixSocket;
        }

        if (options.port) {
            const portNumber = Number(options.port);

            if (usedPorts.find((port) => portNumber === port)) {
                throw new Error(
                    "Unique ports must be specified for each devServer option in your webpack configuration. Alternatively, run only 1 devServer config using the --config-name flag to specify your desired config.",
                );
            }

            usedPorts.push(portNumber);
        }

        devServersOptions.push({ compiler, options });
    }

    const servers = [];

    for (const devServerOptions of devServersOptions) {
        const { compiler, options } = devServerOptions;
        const server = new Server(compiler, options);

        if (isDevServer4) {
            server.server.on("error", (e) => {
                if (e.code === "EADDRINUSE") {
                    const clientSocket = new net.Socket();

                    clientSocket.on("error", (err: any) => {
                        if (err.code === "ECONNREFUSED") {
                            // No other server listening on this socket so it can be safely removed
                            unlinkSync(cliOptions.unixSocket);

                            server.listen(cliOptions.unixSocket, options.host, (error) => {
                                if (error) {
                                    throw error;
                                }
                            });
                        }
                    });

                    clientSocket.connect({ path: cliOptions.unixSocket }, () => {
                        throw new Error("This socket is already used");
                    });
                }
            });

            logger.info(`Listening to socket at ${cliOptions.unixSocket}`);

            server.listen(cliOptions.unixSocket, options.host, (err) => {
                if (err) {
                    throw err;
                }

                // chmod 666 (rw rw rw)
                const READ_WRITE = 438;

                chmod(cliOptions.unixSocket, READ_WRITE, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            });
        } else {
            server.listen(options.port, options.host, (err) => {
                if (err) {
                    throw err;
                }
            });
        }

        servers.push(server);
    }

    return servers;
}
