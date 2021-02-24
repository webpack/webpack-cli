import { config, version } from 'webpack';

let configKeys;
if (version.startsWith('5')) {
    configKeys = Object.keys(config.getNormalizedWebpackOptions({}));
} else {
    configKeys = [
        'amd',
        'bail',
        'cache',
        'context',
        'devServer',
        'devtool',
        'entry',
        'externals',
        'merge',
        'mode',
        'module',
        'node',
        'optimization',
        'output',
        'parallelism',
        'performance',
        'plugins',
        'profile',
        'recordsInputPath',
        'recordsOutputPath',
        'recordsPath',
        'resolve',
        'resolveLoader',
        'splitChunks',
        'stats',
        'target',
        'topScope',
        'watch',
        'watchOptions',
    ];
}

/**
 *
 * A Set of all accepted properties
 *
 * @returns {Set} A new set with accepted webpack properties
 */
export const PROP_TYPES: Set<string> = new Set(configKeys);
