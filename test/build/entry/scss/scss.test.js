/* eslint-disable   node/no-unpublished-require */
const { runAsync, runInstall } = require('../../../utils/test-utils');

describe('entry point', () => {
    it('should support SCSS files', async () => {
        await runInstall(__dirname);

        const { stdout } = await runAsync(__dirname);

        expect(stdout).toBeTruthy();
        expect(stdout).toContain('home.scss');
        expect(stdout).toContain('home.js');
    });
});
