import fs from 'fs';
import { utils } from 'webpack-cli';

const { logger } = utils;

/**
 *
 * Runs prettier and later prints the output configuration
 *
 * @param {string} outputPath - Path to write the config to
 * @param {string} source - AST to write at the given path
 * @returns {void} Writes a file at given location
 */

export function runPrettier(outputPath: string, source: string, fileName: string): void {
    let prettySource: string = source;

    let prettier;

    try {
        // eslint-disable-next-line node/no-extraneous-require
        prettier = require('prettier');
    } catch (err) {
        logger.warn(`${fileName} is not formatted because prettier is not installed locally.`);

        return fs.writeFileSync(outputPath, source, 'utf8');
    }

    try {
        prettySource = prettier.format(source, { filepath: outputPath, parser: 'babel' });
    } catch (error) {
        logger.warn(`\nWARNING: Could not apply prettier to ${outputPath} due to validation error, but the file has been created`);
        prettySource = source;
    }

    fs.writeFileSync(outputPath, prettySource, 'utf8');
}
