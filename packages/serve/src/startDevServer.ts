// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Server: any;
try {
    Server = require('webpack-dev-server/lib/Server');
} catch (err) {
    throw new Error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
}

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
    const devServerOptions = firstWpOpt.devServer || {};

    const host = options.host || devServerOptions.host || 'localhost';
    const port = options.port || devServerOptions.port || 8080;
    // socket should not have a default value, because it should only be used if the
    // user explicitly provides it
    const socket = options.socket || devServerOptions.socket;

    options.host = host;
    options.port = port;
    if (socket) {
        options.socket = socket;
    }

    const server = new Server(compiler, options);
    server.listen(socket || port, host, (err): void => {
        if (err) {
            throw err;
        }
    });
}
