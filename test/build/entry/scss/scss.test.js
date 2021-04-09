/* eslint-disable   node/no-unpublished-require */
const { run } = require('../../../utils/test-utils');

describe('entry point', () => {
    it('should support SCSS files', async () => {
        const { stdout } = run(__dirname);

        expect(stdout).toBeTruthy();
        expect(stdout).toContain('home.scss');
        expect(stdout).toContain('home.js');
    });
});
