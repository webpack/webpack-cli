'use strict';

const { runWatch } = require('../utils/test-utils');

describe('--watch flag', () => {
    it('should watch for file changes', async () => {
        const { stdout } = await runWatch({
            testCase: __dirname,
            args: ['--watch'],
            setOutput: false,
            outputKillStr: 'main',
        });

        expect(stdout).toContain('watching files for updates...');
    });
});
