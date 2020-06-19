'use strict';

const { run } = require('../utils/test-utils');
const pkgJSON = require('../../packages/webpack-cli/package.json');

describe('single version flag', () => {
    it('outputs versions with command syntax', () => {
        const { stdout, stderr } = run(__dirname, ['version'], false);
        expect(stdout).toContain(pkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs versions with dashed syntax', () => {
        const { stdout, stderr } = run(__dirname, ['--version'], false);
        expect(stdout).toContain(pkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs versions with alias syntax', () => {
        const { stdout, stderr } = run(__dirname, ['-v'], false);
        expect(stdout).toContain(pkgJSON.version);
        expect(stderr).toHaveLength(0);
    });
});
