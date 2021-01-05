import { devServerOptionsType } from './types';

/**
 *
 * Starts the devServer
 *
 * @param {Object} compiler - a webpack compiler
 * @param {Object} cliOptions - devServer args
 * @param {Object} logger - logger
 *
 * @returns {Object[]} array of resulting servers
 */
export default async function startDevServer(compiler, cliOptions, logger): Promise<object[]> {
    let devServerVersion, Server, findPort;

    try {
        // eslint-disable-next-line node/no-extraneous-require
        devServerVersion = require('webpack-dev-server/package.json').version;
        // eslint-disable-next-line node/no-extraneous-require
        Server = require('webpack-dev-server/lib/Server');
        // eslint-disable-next-line node/no-extraneous-require
        findPort = require('webpack-dev-server/lib/utils/findPort');
    } catch (err) {
        logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
        process.exit(2);
    }

    const mergeOptions = (cliOptions: devServerOptionsType, devServerOptions: devServerOptionsType): devServerOptionsType => {
        // CLI options should take precedence over devServer options,
        // and CLI options should have no default values included
        const options = { ...devServerOptions, ...cliOptions };

        if (devServerOptions.client && cliOptions.client) {
            // the user could set some client options in their devServer config,
            // then also specify client options on the CLI
            options.client = { ...devServerOptions.client, ...cliOptions.client };
        }

        return options;
    };

    const isMultiCompiler = Boolean(compiler.compilers);

    let compilersWithDevServerOption;

    if (isMultiCompiler) {
        compilersWithDevServerOption = compiler.compilers.filter((compiler) => compiler.options.devServer);

        // No compilers found with the `devServer` option, let's use first compiler
        if (compilersWithDevServerOption.length === 0) {
            compilersWithDevServerOption = [compiler.compilers[0]];
        }
    } else {
        compilersWithDevServerOption = [compiler];
    }

    const isDevServer4 = devServerVersion.startsWith('4');
    const usedPorts = [];
    const devServersOptions = [];

    for (const compilerWithDevServerOption of compilersWithDevServerOption) {
        const options = mergeOptions(cliOptions, compilerWithDevServerOption.options.devServer || {});

        if (isDevServer4) {
            options.port = await findPort(options.port);
            options.client = options.client || {};
            options.client.port = options.client.port || options.port;
        } else {
            if (!options.publicPath) {
                options.publicPath =
                    typeof compilerWithDevServerOption.options.output.publicPath === 'undefined' ||
                    compilerWithDevServerOption.options.output.publicPath === 'auto'
                        ? '/'
                        : compilerWithDevServerOption.options.output.publicPath;
            }

            options.host = options.host || 'localhost';
            options.port = options.port || 8080;
            options.stats = compilerWithDevServerOption.options.stats;
        }

        if (options.port) {
            const portNumber = Number(options.port);

            if (usedPorts.find((port) => portNumber === port)) {
                throw new Error(
                    'Unique ports must be specified for each devServer option in your webpack configuration. Alternatively, run only 1 devServer config using the --config-name flag to specify your desired config.',
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

        server.listen(options.port, options.host, (error): void => {
            if (error) {
                throw error;
            }
        });

        servers.push(server);
    }

    return servers;
}
