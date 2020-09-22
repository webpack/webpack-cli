import fs from 'fs';
import path from 'path';
import { sync } from 'execa';

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
    const hasLocalNpm = fs.existsSync(path.resolve(process.cwd(), 'package-lock.json'));

    if (hasLocalYarn) {
        return 'yarn';
    } else if (hasLocalNpm) {
        return 'npm';
    }

    try {
        // if the sync function below fails because yarn is not installed,
        // an error will be thrown
        if (sync('yarn', ['--version']).stdout) {
            return 'yarn';
        }
    } catch (e) {
        // Nothing
    }

    return 'npm';
}
