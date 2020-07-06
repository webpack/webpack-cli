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
    const devServerOptions = getDevServerOptions(compiler);
    const options = mergeOptions(cliOptions, devServerOptions);

    options.host = options.host || 'localhost';
    options.port = options.port || 8080;

    const server = new Server(compiler, options);
    server.listen(options.port, options.host, (err): void => {
        if (err) {
            throw err;
        }
    });
}
