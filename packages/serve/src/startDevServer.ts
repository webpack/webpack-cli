import { utils } from 'webpack-cli';

import getDevServerOptions from './getDevServerOptions';
import mergeOptions from './mergeOptions';

const { logger } = utils;

/**
 *
 * Starts the devServer
 *
 * @param {Object} compiler - a webpack compiler
 * @param {Object} devServerArgs - devServer args
 *
 * @returns {Object[]} array of resulting servers
 */
export default async function startDevServer(compiler, cliOptions): Promise<object[]> {
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

    const devServerOptions = getDevServerOptions(compiler);
    const servers = [];
    const usedPorts: number[] = [];

    for (const devServerOpts of devServerOptions) {
        const options = mergeOptions(cliOptions, devServerOpts);

        if (isDevServer4) {
            options.port = await findPort(options.port);
            options.client = options.client || {};
            options.client.port = options.client.port || options.port;
        } else {
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
