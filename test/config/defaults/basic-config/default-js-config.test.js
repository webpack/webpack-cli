const fs = require('fs');
const path = require('path');
const { run, isWebpack5 } = require('../../../utils/test-utils');

describe('Zero Config', () => {
    it('runs when config is present but not supplied via flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, [], false);
        // default entry should be used
        expect(stdout).toContain('./src/index.js');
        // should pick up the output path from config
        expect(stdout).toContain('test-output');
        if (!isWebpack5) {
            expect(stdout).toContain('Hash');
            expect(stdout).toContain('Version');
            expect(stdout).toContain('Built at');
            expect(stdout).toContain('Time');
        }
        // Should return the correct exit code
        expect(exitCode).toEqual(0);
        // check that the output file exists
        expect(fs.existsSync(path.join(__dirname, '/dist/test-output.js'))).toBeTruthy();
        expect(stderr).toBeFalsy();
    });
});
