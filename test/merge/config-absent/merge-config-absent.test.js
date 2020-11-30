'use strict';

const { run } = require('../../utils/test-utils');

describe('merge flag configuration', () => {
    it('Show warning message when the merge config is absent', () => {
        // 2.js doesn't exist, let's try merging with it
        const { exitCode, stdout, stderr } = run(__dirname, ['--config', './1.js', '--merge', './2.js'], false);

        expect(exitCode).toBe(2);
        // Since the process will exit, nothing on stdout
        expect(stdout).toBeFalsy();
        // Confirm that the user is notified
        expect(stderr).toContain('At least two configurations are required for merge.');
    });
});
