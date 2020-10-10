'use strict';
jest.setMock('webpack-cli/lib/utils/get-package-manager', {
    getPackageManager: jest.fn(),
});
// eslint-disable-next-line node/no-missing-import
import { getPathToGlobalPackages } from '../lib/global-packages-path';
import { getPackageManager } from 'webpack-cli/lib/utils/get-package-manager';
jest.mock('execa');
jest.mock('cross-spawn');
const globalModulesNpmValue = 'test-npm';
jest.setMock('global-modules', globalModulesNpmValue);

import * as path from 'path';
import * as spawn from 'cross-spawn';

describe('getPathToGlobalPackages', () => {
    it('uses global-modules if package manager is npm', () => {
        (getPackageManager as jest.Mock).mockReturnValue('npm');
        expect(getPathToGlobalPackages()).toEqual(globalModulesNpmValue);
    });

    it('executes a command to find yarn global dir if package manager is yarn', () => {
        (getPackageManager as jest.Mock).mockReturnValue('yarn');
        (spawn.sync as jest.Mock).mockReturnValue({
            stdout: {
                toString: (): string => {
                    return 'test-yarn';
                },
            },
        });
        // after the yarn global dir is found, the node_modules directory
        // is added on to the path
        expect(getPathToGlobalPackages()).toEqual(`test-yarn${path.sep}node_modules`);
    });
});
