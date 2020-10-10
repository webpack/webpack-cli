import { devServerOptionsType } from './types';

/**
 *
 * Merges CLI options and devServer options from config file
 *
 * @param {Object} cliOptions - devServer CLI args
 * @param {Object} devServerOptions - devServer config options
 *
 * @returns {Object} merged options object
 */
export default function mergeOptions(cliOptions: devServerOptionsType, devServerOptions: devServerOptionsType): devServerOptionsType {
    // CLI options should take precedence over devServer options,
    // and CLI options should have no default values included
    const options = { ...devServerOptions, ...cliOptions };

    if (devServerOptions.client && cliOptions.client) {
        // the user could set some client options in their devServer config,
        // then also specify client options on the CLI
        options.client = { ...devServerOptions.client, ...cliOptions.client };
    }

    return options;
}
