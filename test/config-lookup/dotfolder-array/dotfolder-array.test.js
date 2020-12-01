'use strict';

const { run } = require('../../utils/test-utils');

describe('dotfolder array config lookup', () => {
    it('should find a webpack array configuration in a dotfolder', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'amd' starting...");
        expect(stderr).toContain("Compilation 'amd' finished");
        expect(stderr).toContain("Compilation 'commonjs' starting...");
        expect(stderr).toContain("Compilation 'commonjs' finished");
        expect(stdout).toBeTruthy();
    });
});
