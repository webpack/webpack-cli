/**
 *
 * Creates a devServer config from CLI args
 *
 * @param {Object} args - devServer args
 *
 * @returns {Object} valid devServer options object
 */
export default function createConfig(args): any {
    const options = { ...args };

    if (options.clientLogging) {
        options.client = {
            logging: options.clientLogging,
        };
        delete options.clientLogging;
    }

    if (options.hotOnly) {
        options.hot = 'only';
        delete options.hotOnly;
    }

    return args;
}
