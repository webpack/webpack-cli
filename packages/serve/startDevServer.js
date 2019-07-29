const fs = require('fs');
const net = require('net');

const webpack = require('webpack');
const Server = require('webpack-dev-server/lib/Server');
const colors = require('webpack-dev-server/lib/utils/colors');
const createLogger = require('webpack-dev-server/lib/utils/createLogger');
const findPort = require('webpack-dev-server/lib/utils/findPort');

function startDevServer(config, options) {
    const log = createLogger(options);

    let compiler;

    try {
        compiler = webpack(config);
    } catch (err) {
        if (err instanceof webpack.WebpackOptionsValidationError) {
            log.error(colors.error(options.stats.colors, err.message));
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }

        throw err;
    }

    try {
        server = new Server(compiler, options, log);
    } catch (err) {
        if (err.name === 'ValidationError') {
            log.error(colors.error(options.stats.colors, err.message));
            // eslint-disable-next-line no-process-exit
            process.exit(1);
        }

        throw err;
    }

    if (options.socket) {
        server.listeningApp.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                const clientSocket = new net.Socket();

                clientSocket.on('error', (err) => {
                    if (err.code === 'ECONNREFUSED') {
                        // No other server listening on this socket so it can be safely removed
                        fs.unlinkSync(options.socket);

                        server.listen(options.socket, options.host, (error) => {
                            if (error) {
                                throw error;
                            }
                        });
                    }
                });

                clientSocket.connect({ path: options.socket }, () => {
                    throw new Error('This socket is already used');
                });
            }
        });

        server.listen(options.socket, options.host, (err) => {
            if (err) {
                throw err;
            }

            // chmod 666 (rw rw rw)
            const READ_WRITE = 438;

            fs.chmod(options.socket, READ_WRITE, (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    } else {
        findPort(options.port)
            .then((port) => {
                options.port = port;
                server.listen(options.port, options.host, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            })
            .catch((err) => {
                throw err;
            });
    }
}

module.exports = startDevServer;
