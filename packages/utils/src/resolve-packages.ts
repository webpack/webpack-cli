import { bold } from 'colorette';
import logger from 'webpack-cli/lib/utils/logger';
import path from 'path';
import { modifyHelperUtil } from './modify-config-helper';
import { getPathToGlobalPackages, spawnChild } from '@webpack-cli/package-utils';
import { isLocalPath } from './path-utils';
import { ExecaSyncReturnValue } from 'execa';

interface ChildProcess {
    status: number;
}

/**
 *
 * Attaches a promise to the installation of the package
 *
 * @param {Function} child - The function to attach a promise to
 * @returns {Promise} promise - Returns a promise to the installation
 */

export function processPromise(child: ExecaSyncReturnValue): Promise<void> {
    return new Promise((resolve: () => void, reject: () => void): void => {
        if (child.exitCode !== 0) {
            reject();
        } else {
            resolve();
        }
    });
}

/**
 *
 * Resolves and installs the packages, later sending them to @creator
 *
 * @param {String[]} pkg - The dependencies to be installed
 * @returns {Function|Error} creator - Builds
 * a webpack configuration through yeoman or throws an error
 */

export function resolvePackages(pkg: string[]): Function | void {
    Error.stackTraceLimit = 30;

    const packageLocations: string[] = [];

    function invokeGeneratorIfReady(): void {
        if (packageLocations.length === pkg.length) {
            modifyHelperUtil('init', null, null, packageLocations);
        }
    }

    pkg.forEach((scaffold: string): void => {
        // Resolve paths to modules on local filesystem
        if (isLocalPath(scaffold)) {
            let absolutePath: string = scaffold;

            try {
                absolutePath = path.resolve(process.cwd(), scaffold);
                require.resolve(absolutePath);
                packageLocations.push(absolutePath);
            } catch (err) {
                logger.error(`Cannot find a generator at ${absolutePath}.`);
                logger.error('Reason:');
                logger.error(bold(err));
                process.exitCode = 1;
            }

            invokeGeneratorIfReady();
            return;
        }

        // Resolve modules on npm registry
        processPromise(spawnChild(scaffold))
            .then((): void => {
                try {
                    const globalPath: string = getPathToGlobalPackages();
                    packageLocations.push(path.resolve(globalPath, scaffold));
                } catch (err) {
                    logger.error("Package wasn't validated correctly...");
                    logger.error('Submit an issue for', pkg, 'if this persists');
                    logger.error('Reason:');
                    logger.error(bold(err));
                    process.exitCode = 1;
                }
            })
            .catch((err: string): void => {
                logger.error("Package couldn't be installed, aborting...");
                logger.error('Reason:');
                logger.error(bold(err));
                process.exitCode = 1;
            })
            .then(invokeGeneratorIfReady);
    });
}
