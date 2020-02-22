import execa, { ExecaSyncReturnValue, sync } from 'execa';
import { getPackageManager, getPathToGlobalPackages } from './packageUtils';
import path from 'path';
import fs from 'fs';

/**
 *
 * Spawns a new process using the respective package manager
 *
 * @param {String} pkg - The dependency to be installed
 * @param {Boolean} isNew - indicates if it needs to be updated or installed
 * @returns {Function} spawn - Installs the package
 */

function spawnWithArg(pkg: string, isNew: boolean): ExecaSyncReturnValue {
    const packageManager: string = getPackageManager();
    let options = [];

    if (packageManager === 'npm') {
        options = [isNew ? 'install' : 'update', '-g', pkg];
    } else {
        options = ['global', isNew ? 'add' : 'upgrade', pkg];
    }

    return sync(packageManager, options, {
        stdio: 'inherit',
    });
}

/**
 *
 * Spawns a new process
 *
 */
export function spawnChild(pkg: string): ExecaSyncReturnValue {
    const rootPath: string = getPathToGlobalPackages();
    const pkgPath: string = path.resolve(rootPath, pkg);
    const isNew = !fs.existsSync(pkgPath);

    return spawnWithArg(pkg, isNew);
}

export async function runCommand(command, args = []): Promise<void> {
    try {
        await execa(command, args, {
            stdio: 'inherit',
            shell: true,
        });
    } catch (e) {
        throw new Error(e);
    }
}
