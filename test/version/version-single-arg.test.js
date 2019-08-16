'use strict';

const { run } = require('../utils/test-utils');
const pkgLock = require('../../package.json');

describe('single version flag', () => {
    it('outputs versions with command syntax', () => {
        const { stdout, stderr } = run(__dirname, ['version']);
        expect(stdout).toContain(pkgLock.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs versions with dashed syntax', () => {
        const { stdout, stderr } = run(__dirname, ['--version']);
        expect(stdout).toContain(pkgLock.version);
        expect(stderr).toHaveLength(0);
    });
});
