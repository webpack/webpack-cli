import createConfig from './createConfig';
import getDevServerOptions from './getDevServerOptions';
import mergeOptions from './mergeOptions';

/**
 *
 * Starts the devServer
 *
 * @param {Object} compiler - a webpack compiler
 * @param {Object} args - devServer args
 *
 * @returns {Void}
 */
export default function startDevServer(compiler, args): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Server = require('webpack-dev-server/lib/Server');
    const cliOptions = createConfig(args);
    const devServerOptions = getDevServerOptions(compiler, args);

    const usedPorts: number[] = [];
    devServerOptions.forEach((devServerOpts): void => {
        const options = mergeOptions(cliOptions, devServerOpts);

        options.host = options.host || 'localhost';
        options.port = options.port || 8080;

        const portNum = +options.port;

        if (usedPorts.find((port) => portNum === port)) {
            throw new Error(
                'Unique ports must be specified for each devServer option in your webpack configuration. Alternatively, run only 1 devServer config using the --name flag to specify your desired config.',
            );
        }
        usedPorts.push(portNum);

        const server = new Server(compiler, options);
        server.listen(options.port, options.host, (err): void => {
            if (err) {
                throw err;
            }
        });
    });
}
