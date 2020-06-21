const fs = require('fs');
const { join } = require('path');
const { run } = require('../utils/test-utils');
const rimraf = require('rimraf');

describe('Prefetch Flag', () => {
    afterEach(() => {
        rimraf.sync(join(__dirname, 'dist'));
    });

    it('Should load the prefetched file', () => {
        const { stdout, stderr } = run(__dirname, ['--prefetch', './src/p.js'], false);
        // Should be able to find the entry file
        expect(stdout).toContain('./src/index.js');
        // Should contain the prefetched file
        expect(stdout).toContain('./src/p.js');
        expect(stdout).toContain('[prefetched]');
        // check that the output file exists
        expect(fs.existsSync(join(__dirname, '/dist/main.js'))).toBeTruthy();
        expect(stderr).toBeFalsy();
    });

    it('Should err when the prefetched file is absent', () => {
        const { stdout, stderr } = run(__dirname, ['--prefetch', './src/somefile.js'], false);
        // Should contain the error message
        expect(stdout).toContain('ERROR in Entry module not found:');
        expect(stdout).not.toContain('[prefetched]');
        // check that the output file does not exist since prefetched file is not found
        expect(fs.existsSync(join(__dirname, '/dist/main.js'))).toBeFalsy();
        expect(stderr).toBeFalsy();
    });
});
