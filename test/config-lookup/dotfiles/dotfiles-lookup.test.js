'use strict';
const { run } = require('../../utils/test-utils');

describe('config lookup test : dotfolder', () => {
    it('should find a webpack configuration in a dotfolder', () => {
        const { stdout, stderr } = run(__dirname, [], false);
        expect(stderr).not.toBeUndefined();
        expect(stdout).not.toBeUndefined();
    });
});
