'use strict';
import { getPathToGlobalPackages } from '../lib/global-packages-path';
jest.mock('execa');
jest.mock('cross-spawn');
const globalModulesNpmValue = 'test-npm';
jest.setMock('global-modules', globalModulesNpmValue);
const getPackageManagerMock = jest.fn();

import path from 'path';
import spawn from 'cross-spawn';

describe('getPathToGlobalPackages', () => {
    it('uses global-modules if package manager is npm', () => {
        getPackageManagerMock.mockReturnValue('npm');
        expect(getPathToGlobalPackages()).toEqual(globalModulesNpmValue);
    });

    it('executes a command to find yarn global dir if package manager is yarn', () => {
        getPackageManagerMock.mockReturnValue('yarn');
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
