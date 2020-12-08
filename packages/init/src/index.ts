import { initGenerator } from '@webpack-cli/generators';
import { modifyHelperUtil, npmPackagesExists } from '@webpack-cli/utils';

const AUTO_PREFIX = '--auto';
const CONFIG_PREFIX = '--force';
const PATH_PREFIX = '--generation-path';

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

export default function initializeInquirer(args: string[]): Function | void {
    const packages = args;
    const includesDefaultPrefix = packages.includes(AUTO_PREFIX);
    const generateConfig = packages.includes(CONFIG_PREFIX);
    const genPathPrefix = packages.includes(PATH_PREFIX);

    let generationPath: string;

    if (genPathPrefix) {
        const idx = packages.indexOf(PATH_PREFIX);
        // Retrieve the path supplied along with --generation-path
        generationPath = packages[idx + 1];
    }

    if (packages.length === 0 || includesDefaultPrefix || generateConfig || genPathPrefix) {
        return modifyHelperUtil('init', initGenerator, null, null, includesDefaultPrefix, generateConfig, generationPath);
    }

    return npmPackagesExists(packages);
}
