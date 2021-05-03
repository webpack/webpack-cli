import fs from 'fs';
import path from 'path';
import { sync } from 'execa';

import utils from './index';

/**
 *
 * Returns the name of package manager to use,
 * preference order - npm > yarn > pnpm
 *
 * @returns {String} - The package manager name
 */
const getPackageManager = (): string => {
    const hasLocalNpm = fs.existsSync(path.resolve(process.cwd(), 'package-lock.json'));

    if (hasLocalNpm) {
        return 'npm';
    }

    const hasLocalYarn = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock'));

    if (hasLocalYarn) {
        return 'yarn';
    }

    const hasLocalPnpm = fs.existsSync(path.resolve(process.cwd(), 'pnpm-lock.yaml'));

    if (hasLocalPnpm) {
        return 'pnpm';
    }

    try {
        // the sync function below will fail if npm is not installed,
        // an error will be thrown
        if (sync('npm', ['--version'])) {
            return 'npm';
        }
    } catch (e) {
        // Nothing
    }

    try {
        // the sync function below will fail if yarn is not installed,
        // an error will be thrown
        if (sync('yarn', ['--version'])) {
            return 'yarn';
        }
    } catch (e) {
        // Nothing
    }

    try {
        // the sync function below will fail if pnpm is not installed,
        // an error will be thrown
        if (sync('pnpm', ['--version'])) {
            return 'pnpm';
        }
    } catch (e) {
        utils.logger.error('No package manager found.');
        process.exit(2);
    }
};

export default getPackageManager;
