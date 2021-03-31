'use strict';

const path = require('path');

const { runAsync } = require('../../../utils/test-utils');

describe('merge flag configuration', () => {
    it('Show warning message when the merge config is absent', async () => {
        // 2.js doesn't exist, let's try merging with it
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config', './1.js', '--config', './2.js', '--merge'], false);

        expect(exitCode).toEqual(2);
        // Since the process will exit, nothing on stdout
        expect(stdout).toBeFalsy();
        // Confirm that the user is notified
        expect(stderr).toContain(`Failed to load '${path.resolve(__dirname, './2.js')}' config`);
    });
});
