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
        // Should invoke the PrefetchPlugin with correct params
        expect(stdout).toContain(`PrefetchPlugin { context: null, request: './src/p.js' }`);
        // check that the output file exists
        expect(fs.existsSync(join(__dirname, '/dist/main.js'))).toBeTruthy();
        expect(stderr).toBeFalsy();
    });

    it('Should err when the prefetched file is absent', () => {
        const { stdout, stderr } = run(__dirname, ['--prefetch', './src/somefile.js'], false);
        // Should contain the error message
        expect(stdout).toContain(`Error: Can't resolve './src/somefile.js'`);
        // check that the output file does not exist since prefetched file is not found
        expect(fs.existsSync(join(__dirname, '/dist/main.js'))).toBeFalsy();
        expect(stderr).toBeFalsy();
    });

    it('Should err when flag value is not supplied', () => {
        const { stdout, stderr } = run(__dirname, ['--prefetch'], false);
        // Should contain the error message
        expect(stderr).toContain(`error: option '--prefetch <value>' argument missing`);
        expect(stdout).toBeFalsy();
    });
});
