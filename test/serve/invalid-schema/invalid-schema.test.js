'use strict';
const { run, isWebpack5 } = require('../../utils/test-utils');

describe('invalid schema', () => {
    it('should log webpack error and exit process on invalid config', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['serve', '--config', './webpack.config.mock.js']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });

    it('should log webpack error and exit process on invalid flag', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['serve', '--mode', 'Yukihira']);

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
