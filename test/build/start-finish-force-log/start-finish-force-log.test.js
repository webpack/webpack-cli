'use strict';

const { run } = require('../../utils/test-utils');

describe('start finish force log', () => {
    it('start finish force log when env is set', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], {
            env: { WEBPACK_CLI_START_FINISH_FORCE_LOG: true },
        });
        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compiler starting...');
        expect(stderr).toContain('Compiler finished');
        expect(stdout).toBeTruthy();
    });

    it('should show name of the config', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--name', 'log config'], {
            env: { WEBPACK_CLI_START_FINISH_FORCE_LOG: true },
        });
        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compiler 'log config' starting...");
        expect(stderr).toContain("Compiler 'log config' finished");
        expect(stdout).toBeTruthy();
    });

    it('should work with multi compiler', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', './webpack.config.array.js'], {
            env: { WEBPACK_CLI_START_FINISH_FORCE_LOG: true },
        });
        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compiler 'Gojou' starting...");
        expect(stderr).toContain("Compiler 'Satoru' starting...");
        expect(stderr).toContain("Compiler 'Gojou' finished");
        expect(stderr).toContain("Compiler 'Satoru' finished");
        expect(stdout).toBeTruthy();
    });
});
