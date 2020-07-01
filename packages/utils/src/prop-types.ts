// eslint-disable-next-line node/no-extraneous-import
import { config } from 'webpack';
const configKeys = Object.keys(config.getNormalizedWebpackOptions({}));

/**
 *
 * A Set of all accepted properties
 *
 * @returns {Set} A new set with accepted webpack properties
 */
export const PROP_TYPES: Set<string> = new Set(configKeys);
