/* eslint-disable   node/no-missing-require */
/* eslint-disable   node/no-unpublished-require */
const { run, runInstall } = require('../../utils/test-utils');

describe('entry point', () => {
    it(
        'should support SCSS files',
        async () => {
            await runInstall();
            const { stdout } = run(__dirname);
            expect(stdout).toBeTruthy();
            expect(stdout).toContain('home.css');
            expect(stdout).toContain('home.js');
        },
        1000 * 60 * 5,
    );
});
