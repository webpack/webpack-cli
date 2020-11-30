'use strict';

const { run } = require('../../utils/test-utils');

describe('single entry flag index present', () => {
    it('finds default index file and compiles successfully', () => {
        const { exitCode, stderr, stdout } = run(__dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stderr).not.toContain('Module not found');
        expect(stdout).toBeTruthy();
    });

    it('finds default index file, compiles and overrides with flags successfully', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-path', 'bin']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });
});
