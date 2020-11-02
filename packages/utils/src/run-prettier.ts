import fs from 'fs';
import { utils } from 'webpack-cli';

const { logger } = utils;

/**
 *
 * Runs prettier and later prints the output configuration
 *
 * @param {String} outputPath - Path to write the config to
 * @param {Node} source - AST to write at the given path
 * @returns {Void} Writes a file at given location
 */

export function runPrettier(outputPath: string, source: string): void {
    let prettySource: string = source;

    let prettier;
    try {
        // eslint-disable-next-line node/no-extraneous-require
        prettier = require('prettier');
    } catch (err) {
        logger.warn(
            "File is not properly formatted because you don't have prettier installed, you can either install it or format it manually",
        );
        return fs.writeFileSync(outputPath, source, 'utf8');
    }

    try {
        prettySource = prettier.format(source, {
            filepath: outputPath,
            parser: 'babel',
            singleQuote: true,
            tabWidth: 1,
            useTabs: true,
        });
    } catch (err) {
        logger.warn(`\nWARNING: Could not apply prettier to ${outputPath} due to validation error, but the file has been created`);
        prettySource = source;
    }
    return fs.writeFileSync(outputPath, prettySource, 'utf8');
}
