import Server from 'webpack-dev-server/lib/Server';

/**
 *
 * Starts the devServer
 *
 * @param {Object} compiler - a webpack compiler
 * @param {Object} options - devServer options
 *
 * @returns {Void}
 */
export default function startDevServer(compiler, options): void {
    const firstWpOpt = compiler.compilers ? compiler.compilers[0].options : compiler.options;
    let devServerOptions = firstWpOpt.devServer || {};

    // set default host and port
    devServerOptions = { host: 'localhost', port: 8080, ...devServerOptions };

    // socket should not have a default value, because it should only be used if the
    // user explicitly provides it
    const socket = options.socket || devServerOptions.socket;

    if (socket) {
        options.socket = socket;
    }

    // Compose config from the CLI and devServer object from webpack config
    const serverConfig = { ...options, ...devServerOptions };

    const { host, port } = serverConfig;

    const server = new Server(compiler, serverConfig);
    server.listen(socket || port, host, (err): void => {
        if (err) {
            throw err;
        }
    });
}
