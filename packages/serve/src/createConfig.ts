import { devServerOptionsType } from './types';

/**
 *
 * Creates a devServer config from CLI args
 *
 * @param {Object} args - devServer args
 *
 * @returns {Object} valid devServer options object
 */
export default function createConfig(args): devServerOptionsType {
    const options = { ...args };

    if (options.clientLogging) {
        options.client = {
            logging: options.clientLogging,
        };
        // clientLogging is not a valid devServer option
        delete options.clientLogging;
    }

    if (options.hotOnly) {
        options.hot = 'only';
        // hotOnly is not a valid devServer option
        delete options.hotOnly;
    }

    return options;
}
