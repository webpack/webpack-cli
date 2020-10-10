'use strict';
const { run } = require('../utils/test-utils');

describe('invalid schema', () => {
    it.only('should log webpack error and exit process on invalid config', () => {
        const result = run(__dirname, ['--config', './webpack.config.mock.js']);
        console.log(result);
        expect(result.stderr).toContain('Invalid configuration object');
        expect(result.exitCode).toEqual(1);
    });

    it('should log webpack error and exit process on invalid flag', () => {
        const { stderr, exitCode } = run(__dirname, ['--mode', 'Yukihira']);
        console.log({ stderr, exitCode });
        expect(stderr).toContain('Invalid configuration object');
        expect(exitCode).toEqual(1);
    });
});
