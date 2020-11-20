import { devServerOptionsType } from './types';

/**
 *
 * Creates a devServer config from CLI args
 *
 * @param {Object} args - devServer args
 * @param {boolean} isDevServer4 - is devServer v4
 *
 * @returns {Object} valid devServer options object
 */
export default function createConfig(args, isDevServer4): devServerOptionsType {
    const options = { ...args };

    if (options.clientLogging) {
        options.client = {
            logging: options.clientLogging,
        };
        // clientLogging is not a valid devServer option
        delete options.clientLogging;
    }
    if (isDevServer4 && options.hotOnly) {
        options.hot = 'only';
        // hotOnly is not a valid devServer option
        delete options.hotOnly;
    }

    return options;
}
