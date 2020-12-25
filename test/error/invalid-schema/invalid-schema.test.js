'use strict';
const { run, isWebpack5 } = require('../../utils/test-utils');

describe('invalid schema', () => {
    it('should log error on invalid config', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', './webpack.config.mock.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid config using the "bundle" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle', '--config', './webpack.config.mock.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid config using the "serve" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['serve', '--config', './webpack.config.mock.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "bundle" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "server" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['serve', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });
});
