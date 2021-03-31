'use strict';
const { runAsync, isWebpack5 } = require('../../../utils/test-utils');

describe('invalid schema', () => {
    it('should log error on invalid config', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config', './webpack.mock.config.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid plugin options', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config', './webpack.plugin-mock.config.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain(isWebpack5 ? 'Invalid options object' : 'Invalid Options');
        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid config using the "bundle" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['bundle', '--config', './webpack.mock.config.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid config using the "serve" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['serve', '--config', './webpack.mock.config.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "build" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['build', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "bundle" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['bundle', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "b" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['b', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "watch" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['watch', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "w" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['w', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "server" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['serve', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'Yukihira' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    it('should log error on invalid option using "s" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['s', '--mode', 'Yukihira']);

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
