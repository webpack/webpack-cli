'use strict';
const { join } = require('path');
const { existsSync } = require('fs');
const { run } = require('../../../utils/test-utils');

describe('default entry and config entry all exist', () => {
    it('should use config entry if config entry existed', () => {
        const { stdout, exitCode } = run(__dirname, [], false);

        expect(exitCode).toBe(0);

        // Should contain the relevant entry
        expect(stdout).toContain('./src/app.js');
        expect(stdout).toContain('./src/print.js');

        // Should contain the relevant bundle
        expect(stdout).toContain('app.bundle.js');
        expect(stdout).toContain('print.bundle.js');
        expect(stdout).not.toContain('index.js');
        // Should only generate the files as per the entry in config
        expect(existsSync(join(__dirname, '/dist/app.bundle.js'))).toBeTruthy();
        expect(existsSync(join(__dirname, '/dist/print.bundle.js'))).toBeTruthy();
        // index fallback should not be used even when the file is present
        expect(existsSync(join(__dirname, '/dist/index.bundle.js'))).toBeFalsy();
    });
});
