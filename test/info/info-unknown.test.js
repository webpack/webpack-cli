const { red } = require('colorette');
const { runInfo } = require('../utils/test-utils');

describe('should handle unknown args', () => {
    it('shows an appropriate warning on supplying unknown args', () => {
        const { stderr } = runInfo(['--unknown'], __dirname);
        expect(stderr).toContain(red('[webpack-cli] Unknown argument: --unknown'));
    });
});
