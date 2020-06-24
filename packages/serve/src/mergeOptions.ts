/**
 *
 * Merges CLI options and devServer options from config file
 *
 * @param {Object} cliOptions - devServer args
 *
 * @returns {Object} merged options object
 */
export default function mergeOptions(cliOptions, devServerOptions): any {
    // CLI options should take precedence over devServer options,
    // and CLI options should have no default values included
    return { ...devServerOptions, ...cliOptions };
}
