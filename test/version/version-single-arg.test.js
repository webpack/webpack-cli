'use strict';

const { run } = require('../utils/test-utils');
const pkgJSON = require('../../packages/webpack-cli/package.json');

describe('single version flag', () => {
    it('outputs versions with command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(pkgJSON.version);
    });

    it('outputs versions with dashed syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(pkgJSON.version);
    });

    it('outputs versions with alias syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-v'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(pkgJSON.version);
    });
});
