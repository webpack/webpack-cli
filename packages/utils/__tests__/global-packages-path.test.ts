'use strict';

jest.mock('execa');
jest.mock('cross-spawn');
const globalModulesNpmValue = 'test-npm';
jest.setMock('global-modules', globalModulesNpmValue);

import path from 'path';
import spawn from 'cross-spawn';

describe('getPathToGlobalPackages', () => {
    let packageUtils;
    beforeAll(() => {
        packageUtils = require('../lib/');
        packageUtils.getPackageManager = jest.fn();
    });

    it('uses global-modules if package manager is npm', () => {
        packageUtils.getPackageManager.mockReturnValue('npm');
        expect(packageUtils.getPathToGlobalPackages()).toEqual(globalModulesNpmValue);
    });

    it('executes a command to find yarn global dir if package manager is yarn', () => {
        packageUtils.getPackageManager.mockReturnValue('yarn');
        (spawn.sync as jest.Mock).mockReturnValue({
            stdout: {
                toString: (): string => {
                    return 'test-yarn';
                },
            },
        });
        // after the yarn global dir is found, the node_modules directory
        // is added on to the path
        expect(packageUtils.getPathToGlobalPackages()).toEqual(`test-yarn${path.sep}node_modules`);
    });
});
