const fs = require('fs');
const path = require('path');
const { run } = require('../../utils/test-utils');

describe('Zero Config', () => {
    it('runs when config is present but not supplied via flag', () => {
        const { stdout, stderr } = run(__dirname, [], false);
        // default entry should be used
        expect(stdout).toContain('./index.js');
        // should pick up the output path from config
        expect(stdout).toContain('Entrypoint main = test-output');
        expect(stdout).toContain('Hash');
        expect(stdout).toContain('Version');
        expect(stdout).toContain('Built at');
        expect(stdout).toContain('Time');
        // check that the output file exists
        expect(fs.existsSync(path.join(__dirname, '/dist/test-output.js'))).toBeTruthy();
        expect(stderr).toBeFalsy();
    });
});
