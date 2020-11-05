import { initGenerator } from '@webpack-cli/generators';
import { modifyHelperUtil, npmPackagesExists } from '@webpack-cli/utils';
import options from './options';
import WebpackCLI from 'webpack-cli';
import { utils } from 'webpack-cli';

const { logger } = utils;

/**
 *
 * First function to be called after running the init flag. This is a check,
 * if we are running the init command with no arguments or if we got dependencies
 *
 * @param	{String[]}		args - array of arguments such as
 * packages included when running the init command
 * @returns	{Function}	creator/npmPackagesExists - returns an installation of the package,
 * followed up with a yeoman instance if there are packages. If not, it creates a defaultGenerator
 */

export default function initializeInquirer(...args: string[]): Function | void {
    const cli = new WebpackCLI();
    const { opts, unknownArgs } = cli.argParser(options, args, true);
    const { auto: includesDefaultPrefix, force: generateConfig } = opts;

    const unknownFlags = unknownArgs.filter((arg) => arg.startsWith('-'));
    if (unknownFlags.length > 0) {
        logger.error(`Unknown argument: ${unknownFlags}`);
        process.exit(2);
    }

    if (args.length === 0 || includesDefaultPrefix || generateConfig) {
        return modifyHelperUtil('init', initGenerator, null, null, includesDefaultPrefix, generateConfig);
    }
    return npmPackagesExists(args);
}
