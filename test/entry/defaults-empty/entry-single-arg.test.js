'use strict';

const { run } = require('../../utils/test-utils');

describe('single entry flag empty project', () => {
    it('sets default entry, compiles but throw missing module error', () => {
        const { stdout, stderr } = run(__dirname);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
