'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('function configuration', () => {
    it('is able to understand a configuration file as a function', () => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'development']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/dev.js'))).toBeTruthy();
    });
});
