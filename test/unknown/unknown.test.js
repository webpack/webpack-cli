const { run } = require('../utils/test-utils');

describe('unknown behaviour', () => {
    it('warns the user if an unknown flag is passed in', () => {
        const { stderr } = run(__dirname, ['--unknown']);
        expect(stderr).toBeTruthy();
        expect(stderr).toContain('Unknown argument: --unknown');
    });
});
