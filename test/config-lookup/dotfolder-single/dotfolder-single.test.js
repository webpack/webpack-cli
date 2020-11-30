'use strict';

const { run } = require('../../utils/test-utils');

describe('dotfolder single config lookup', () => {
    it('should find a webpack configuration in a dotfolder', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).not.toContain('Module not found');
        expect(stdout).toBeTruthy();
    });
});
