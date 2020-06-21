const fs = require('fs');
const { join } = require('path');
const { run } = require('../utils/test-utils');
const rimraf = require('rimraf');

describe('Prefetch Flag', () => {
    afterAll(() => {
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
});
