const stripAnsi = require('strip-ansi');
const { runInfo } = require('../utils/test-utils');

describe('should handle unknown args', () => {
    it('shows an appropriate warning on supplying unknown args', () => {
        const { stderr, exitCode } = runInfo(['--unknown'], __dirname);

        expect(exitCode).toBe(2);
        expect(stripAnsi(stderr)).toContain('[webpack-cli] Unknown argument: --unknown');
    });
});
