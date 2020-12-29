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
    let isDevServer4 = false,
        devServerVersion,
        Server,
        findPort;

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

    isDevServer4 = devServerVersion.startsWith('4');

    const defaultOpts = {};
    const devServerOptions = [];
    const compilers = compiler.compilers || [compiler];

    compilers.forEach((compiler) => {
        if (compiler.options.devServer) {
            devServerOptions.push(compiler.options.devServer);
        }
    });

    if (devServerOptions.length === 0) {
        devServerOptions.push(defaultOpts);
    }

    const servers = [];
    const usedPorts: number[] = [];
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

    for (const devServerOpts of devServerOptions) {
        const options = mergeOptions(cliOptions, devServerOpts);

        if (isDevServer4) {
            options.port = await findPort(options.port);
            options.client = options.client || {};
            options.client.port = options.client.port || options.port;
        } else {
            if (!options.publicPath && compiler.options.output && compiler.options.output.publicPath) {
                options.publicPath = compiler.options.output.publicPath === 'auto' ? '/' : compiler.options.output.publicPath;
            }

            options.host = options.host || 'localhost';
            options.port = options.port || 8080;
        }

        if (options.port) {
            const portNum = +options.port;

            if (usedPorts.find((port) => portNum === port)) {
                throw new Error(
                    'Unique ports must be specified for each devServer option in your webpack configuration. Alternatively, run only 1 devServer config using the --config-name flag to specify your desired config.',
                );
            }

            usedPorts.push(portNum);
        }

        const server = new Server(compiler, options);

        server.listen(options.port, options.host, (err): void => {
            if (err) {
                throw err;
            }
        });

        servers.push(server);
    }

    return servers;
}
