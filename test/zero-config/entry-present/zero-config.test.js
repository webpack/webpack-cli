const fs = require('fs');
const path = require('path');
const { run } = require('../../utils/test-utils');

describe('Zero Config tests', () => {
    it('runs when no config is supplied but entry is present', () => {
        const { stdout, stderr } = run(__dirname, [], false);
        // Should be able to find the entry file
        expect(stdout).toContain('./src/index.js');
        // Should output at the default output dir and filename
        expect(stdout).toContain('main.js');
        // check that the output file exists
        expect(fs.existsSync(path.join(__dirname, '/dist/main.js'))).toBeTruthy();
        expect(stderr).toBeFalsy();
    });
});
