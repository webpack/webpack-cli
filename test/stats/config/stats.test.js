'use strict';
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../../utils/test-utils');

describe('stats flag with config', () => {
    it('should compile without stats flag', () => {
        const { stderr, stdout } = run(__dirname, []);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeFalsy();
    });
    it('should compile with stats flag', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'errors-warnings']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeFalsy();
    });
});
