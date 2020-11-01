const { run } = require('../utils/test-utils');

describe('unknown behaviour', () => {
    it('warns the user if an unknown flag is passed in', () => {
        const { stderr } = run(__dirname, ['--unknown']);
        expect(stderr).toBeTruthy();
        expect(stderr).toContain('Unknown argument: --unknown');
    });
    it('suggests the closest match to an unknown flag', () => {
        const { stderr, stdout } = run(__dirname, ['--entyr', './a.js']);
        expect(stderr).toContain('Unknown argument: --entyr');
        expect(stdout).toContain('Did you mean --entry?');
    });
});
