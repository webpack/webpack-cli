import spawn from 'cross-spawn';
import path from 'path';
import { utils } from 'webpack-cli';

const { getPackageManager } = utils;

/**
 *
 * Returns the path to globally installed
 * npm packages, depending on the available
 * package manager determined by `getPackageManager`
 *
 * @returns {String} path - Path to global node_modules folder
 */
export function getPathToGlobalPackages(): string {
    const manager: string = getPackageManager();
    if (manager === 'yarn') {
        try {
            const yarnDir = spawn.sync('yarn', ['global', 'dir']).stdout.toString().trim();
            return path.join(yarnDir, 'node_modules');
        } catch (e) {
            // Default to the global npm path below
        }
    }

    return require('global-modules');
}
