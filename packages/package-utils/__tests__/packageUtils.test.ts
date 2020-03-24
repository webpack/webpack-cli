'use strict';

jest.mock('execa');

import fs from 'fs';
import path from 'path';
import execa from 'execa';
import { getPackageManager } from '@webpack-cli/package-utils';

describe('packageUtils', () => {
    describe('getPackageManager', () => {
        const testYarnLockPath = path.resolve(__dirname, 'test-yarn-lock');
        const testNpmLockPath = path.resolve(__dirname, 'test-npm-lock');
        const testBothPath = path.resolve(__dirname, 'test-both');

        const cwdSpy = jest.spyOn(process, 'cwd');

        // mock sync
        execa.sync = jest.fn();

        beforeAll(() => {
            // package-lock.json is ignored by .gitignore, so we simply
            // write a lockfile here for testing
            fs.writeFileSync(path.resolve(testNpmLockPath, 'package-lock.json'), '');
            fs.writeFileSync(path.resolve(testBothPath, 'package-lock.json'), '');
        });

        beforeEach(() => {
            (execa.sync as jest.Mock).mockClear();
        });

        it('should find yarn.lock', () => {
            cwdSpy.mockReturnValue(testYarnLockPath);
            expect(getPackageManager()).toEqual('yarn');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(0);
        });

        it('should find package-lock.json', () => {
            cwdSpy.mockReturnValue(testNpmLockPath);
            expect(getPackageManager()).toEqual('npm');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(0);
        });

        it('should prioritize yarn with many lock files', () => {
            cwdSpy.mockReturnValue(testBothPath);
            expect(getPackageManager()).toEqual('yarn');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(0);
        });

        it('should use yarn if yarn command works', () => {
            (execa.sync as jest.Mock).mockImplementation(() => {
                return {
                    stdout: '1.0.0'
                };
            });
            cwdSpy.mockReturnValue(path.resolve(__dirname));
            expect(getPackageManager()).toEqual('yarn');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(1);
        });

        it('should use npm if yarn command fails', () => {
            (execa.sync as jest.Mock).mockImplementation(() => {
                throw new Error();
            });
            cwdSpy.mockReturnValue(path.resolve(__dirname));
            expect(getPackageManager()).toEqual('npm');
            expect((execa.sync as jest.Mock).mock.calls.length).toEqual(1);
        });
    });
});
