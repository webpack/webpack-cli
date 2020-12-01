'use strict';
const { run, isWebpack5 } = require('../utils/test-utils');

describe('invalid schema', () => {
    it('should log webpack error and exit process on invalid config', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', './webpack.config.mock.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).not.toContain('Compilation starting...');
        expect(stderr).not.toContain('Compilation finished');
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });

    it('should log webpack error and exit process on invalid flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);
        expect(stderr).not.toContain('Compilation starting...');
        expect(stderr).not.toContain('Compilation finished');

        if (isWebpack5) {
            expect(stderr).toContain("Found the 'invalid-value' problem with the '--mode' argument by path 'mode'");
        }

        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });
});
