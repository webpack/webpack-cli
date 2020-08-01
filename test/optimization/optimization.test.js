const fs = require('fs');
const { join } = require('path');
const { version } = require('webpack');
const { run } = require('../utils/test-utils');

describe('optimization option in config', () => {
    it('should work with mangleExports disabled', () => {
        const { stdout, stderr } = run(__dirname, [], false);
        // Should throw when webpack is less than 5
        if (!version.startsWith('5')) {
            expect(stderr).toContain("configuration.optimization has an unknown property 'mangleExports'");
        } else {
            // Should apply the provided optimization to the compiler
            expect(stdout).toContain('mangleExports: false');
            // check that the output file exists
            expect(fs.existsSync(join(__dirname, '/dist/main.js'))).toBeTruthy();
            expect(stderr).toBeFalsy();
        }
    });
});
