'use strict';

const { run } = require('../utils/test-utils');
const { resolve } = require('path');

describe('--context flag', () => {
    it('should allow to set context', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--context', './']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain(`context: '${resolve(__dirname, './')}'`);
    });
});
