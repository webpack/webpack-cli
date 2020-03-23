import fs from 'fs';
import path from 'path';
import { sync } from 'execa';
import spawn from 'cross-spawn';
import chalk = require('chalk');
import { prompt } from 'enquirer';
import { runCommand } from './processUtils';

/**
 *
 * Returns the name of package manager to use,
 * preferring yarn over npm if available
 *
 * @returns {String} - The package manager name
 */

type PackageName = 'npm' | 'yarn';

export function getPackageManager(): PackageName {
    const hasLocalYarn = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
    try {
        if (hasLocalYarn) {
            return 'yarn';
        } else if (sync('yarn', [' --version'], { stdio: 'ignore' }).stderr) {
            return 'yarn';
        } else {
            return 'npm';
        }
    } catch (e) {
        return 'npm';
    }
}

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
            const yarnDir = spawn
                .sync('yarn', ['global', 'dir'])
                .stdout.toString()
                .trim();
            return path.join(yarnDir, 'node_modules');
        } catch (e) {
            // Default to the global npm path below
        }
    }

    return require('global-modules');
}

export function packageExists(packageName: string): boolean {
    try {
        require(packageName);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 *
 * @param packageName
 * @param preMessage Message to show before the question
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function promptInstallation(packageName: string, preMessage?: Function) {
    const packageManager = getPackageManager();
    const options = [packageManager === 'yarn' ? 'add' : 'install', '-D', packageName];

    const commandToBeRun = `${packageManager} ${options.join(' ')}`;
    if (preMessage) {
        preMessage();
    }
    const question = `Would you like to install ${packageName}? (That will run ${chalk.green(commandToBeRun)})`;
    const { installConfirm } = await prompt([
        {
            type: 'confirm',
            name: 'installConfirm',
            message: question,
            initial: 'Y',
        },
    ]);
    if (installConfirm) {
        await runCommand(commandToBeRun);
        return packageExists(packageName);
    }
    // eslint-disable-next-line require-atomic-updates
    process.exitCode = -1;
}
