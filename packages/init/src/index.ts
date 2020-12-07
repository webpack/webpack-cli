import { initGenerator } from '@webpack-cli/generators';
import { modifyHelperUtil, npmPackagesExists } from '@webpack-cli/utils';

/**
 *
 * First function to be called after running the init flag. This is a check,
 * if we are running the init command with no arguments or if we got dependencies
 *
 * @param	{obj}	args - array of arguments such as
 * packages included when running the init command
 * @returns	{Function}	creator/npmPackagesExists - returns an installation of the package,
 * followed up with a yeoman instance if there are packages. If not, it creates a defaultGenerator
 */

export default function initializeInquirer(args): Function | void {
    const packages = args.unknownArgs;
    const includesDefaultPrefix = args.auto;
    const generateConfig = args.force;
    const generationPath = args.generationPath;

    if (!packages || packages.length === 0 || includesDefaultPrefix || generateConfig || generationPath) {
        return modifyHelperUtil('init', initGenerator, null, null, includesDefaultPrefix, generateConfig, generationPath);
    }
    return npmPackagesExists(packages);
}
