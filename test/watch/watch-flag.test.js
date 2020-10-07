'use strict';

const { runWatch, isWindows } = require('../utils/test-utils');

describe('--watch flag', () => {
    if (isWindows) {
        it('TODO: Fix on windows', () => {
            expect(true).toBe(true);
        });
        return;
    }

    it('should watch for file changes', async () => {
        const { stdout, stderr } = await runWatch({
            testCase: __dirname,
            args: ['--watch'],
            setOutput: false,
            outputKillStr: 'main',
        });
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('watching files for updates...');
    });
});
