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
    // eslint-disable-next-line node/no-extraneous-require
    const version = require('webpack-dev-server/package.json').version;

    const isDevServer4 = version.startsWith('4');

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
