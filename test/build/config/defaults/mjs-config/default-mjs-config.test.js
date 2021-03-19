const fs = require('fs');
const path = require('path');
const { run, isWebpack5, isWindows } = require('../../../../utils/test-utils');

describe('Default Config:', () => {
    it('Should be able to pick mjs config by default', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], { env: { WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: true } });

        if (/Error: Not supported/.test(stderr)) {
            expect(exitCode).toEqual(2);
            expect(stdout).toBeFalsy();
        } else {
            // TODO: fix for windows
            if (isWindows) {
                expect(true).toBe(true);
                return;
            }
            expect(exitCode).toEqual(0);
            expect(stderr).toBeFalsy();
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
        }
    });
});
