'use strict';

const { run } = require('../utils/test-utils');

describe('--entry-reset flag', () => {
    it('should reset entry correctly', () => {
        const { stderr, stdout } = run(__dirname, ['--entry-reset', '--entry', 'src/entry.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('src/entry.js');
        expect(stdout).not.toContain('src/main.js');
    });
});
