'use strict';
const { run } = require('../utils/test-utils');

describe('invalid schema', () => {
    it('should log webpack error and exit process on invalid config', () => {
        const { stderr, exitCode } = run(__dirname, ['--config', './webpack.config.mock.js']);
        expect(stderr).toContain('Invalid configuration object');
        expect(exitCode).toEqual(2);
    });

    it('should log webpack error and exit process on invalid flag', () => {
        const { stderr, exitCode } = run(__dirname, ['--mode', 'Yukihira']);
        expect(stderr).toContain('Invalid configuration object');
        expect(exitCode).toEqual(2);
    });
});
