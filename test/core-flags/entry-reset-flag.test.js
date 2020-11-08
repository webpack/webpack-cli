'use strict';

const { run } = require('../utils/test-utils');

describe('--entry-reset flag', () => {
    it('should reset entry correctly', () => {
        const { stdout, exitCode } = run(__dirname, ['--entry-reset', '--entry', './src/entry.js']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('src/entry.js');
        expect(stdout).not.toContain('src/main.js');
    });
});
