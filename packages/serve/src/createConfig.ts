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
    let isDevServer4 = false;
    try {
        // eslint-disable-next-line node/no-extraneous-require
        const version = require('webpack-dev-server/package.json').version;

        isDevServer4 = version.startsWith('4');
    } catch (err) {
        throw new Error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${err}`);
    }

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
