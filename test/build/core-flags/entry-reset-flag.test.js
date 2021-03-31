'use strict';

const { runAsync } = require('../../utils/test-utils');

describe('--entry-reset flag', () => {
    it('should reset entry correctly', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--entry-reset', '--entry', './src/entry.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('src/entry.js');
        expect(stdout).not.toContain('src/main.js');
    });

    it('should throw error if entry is an empty array', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--entry-reset']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });
});
