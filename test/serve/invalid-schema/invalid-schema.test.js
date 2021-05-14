'use strict';
const { run, normalizeStderr, normalizeStdout, isDevServer4 } = require('../../utils/test-utils');

describe('invalid schema', () => {
    it('should log webpack error and exit process on invalid config', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['serve', '--config', './webpack.config.mock.js']);

        expect(exitCode).toEqual(2);
        expect(normalizeStderr(stderr)).toMatchSnapshot('stderr');
        expect(normalizeStdout(stdout)).toMatchSnapshot('stdout');
    });

    it('should log webpack error and exit process on invalid flag', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['serve', '--mode', 'Yukihira']);

        expect(exitCode).toEqual(2);
        expect(normalizeStderr(stderr)).toMatchSnapshot('stderr');
        expect(normalizeStdout(stdout)).toMatchSnapshot('stdout');
    });

    it('should log webpack-dev-server error and exit process on invalid flag', async () => {
        // Don't check on versions other than v4
        if (!isDevServer4) {
            expect(true).toBe(true);
            return;
        }

        const { exitCode, stderr, stdout } = await run(__dirname, ['serve', '--port', '-1']);

        expect(exitCode).toEqual(2);
        expect(normalizeStderr(stderr).replace('Port', 'options.port')).toMatchSnapshot('stderr');
        expect(normalizeStdout(stdout)).toMatchSnapshot('stdout');
    });

    it('should log webpack-dev-server error and exit process on invalid config', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['serve', '--config', './webpack-dev-server.config.mock.js']);

        expect(exitCode).toEqual(2);
        expect(normalizeStderr(stderr)).toMatchSnapshot('stderr');
        expect(normalizeStdout(stdout)).toMatchSnapshot('stdout');
    });
});
