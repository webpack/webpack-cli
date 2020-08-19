import fs from 'fs';
import prettier from 'prettier';
import logger from 'webpack-cli/lib/utils/logger';

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
    try {
        prettySource = prettier.format(source, {
            filepath: outputPath,
            parser: 'babel',
            singleQuote: true,
            tabWidth: 1,
            useTabs: true,
        });
    } catch (err) {
        logger.warn(`WARNING: Could not apply prettier to ${outputPath} due to validation error, but the file has been created\n`);
        prettySource = source;
    }

    return fs.writeFileSync(outputPath, prettySource, 'utf8');
}
