const { red } = require('colorette');
const { runInfo } = require('../utils/test-utils');

describe('should handle unknown args', () => {
    it('shows an appropriate warning on supplying unknown args', () => {
        const { stderr, stdout, exitCode } = runInfo(['--unknown'], __dirname);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`[webpack-cli] ${red('Unknown argument: --unknown')}`);
        expect(stdout).toBeFalsy();
    });
});
