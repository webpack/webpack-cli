import * as Server from "webpack-dev-server/lib/Server";

/**
 *
 * Starts the devServer
 *
 * @param {Object} compiler - a webpack compiler
 * @param {Object} options - devServer options
 * @param {Function} onListening - optional callback for when the server starts listening
 * 
 * @returns {Void} 
 */
export default function startDevServer(compiler, options, onListening): void {
    const server = new Server(compiler, options);
    // Once the dev server has better socket handling within the API listen method,
    // this will work better
    server.listen(options.socket || options.port, options.host, (err): void => {
        if (err) {
            throw err;
        }
        if (typeof onListening === 'function') {
            onListening();
        }
    });
}