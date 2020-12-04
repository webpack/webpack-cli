const fs = require('fs');
const path = require('path');
const { run, isWebpack5 } = require('../../../utils/test-utils');

describe('Default Config:', () => {
    it('Should be able to pick cjs config by default', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false, [], {});

        if (exitCode === 0) {
            expect(exitCode).toEqual(0);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');
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

            // check that the output file exists
            expect(fs.existsSync(path.join(__dirname, '/dist/test-output.js'))).toBeTruthy();
        } else {
            expect(exitCode).toEqual(2);
            expect(stderr).toContain('Unexpected token');
            expect(stdout).toBeFalsy();
        }
    });
});
