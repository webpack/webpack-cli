'use strict';
const { run } = require('../utils/test-utils');

describe('invalid schema', () => {
    it('should log webpack error and exit process on invalid config', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config', './webpack.config.mock.js']);
        console.log({ stderr, stdout, exitCode });
        expect(stderr).toContain('Invalid configuration object');
        expect(exitCode).toEqual(1);
    });

    it('should log webpack error and exit process on invalid flag', () => {
        const { stderr, exitCode } = run(__dirname, ['--mode', 'Yukihira']);
        expect(stderr).toContain('Invalid configuration object');
        expect(exitCode).toEqual(1);
    });
});
