'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('basic config file', () => {
    it('is able to understand and parse a very basic configuration file', () => {
        const { exitCode } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output-path', './binary'], false);

        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, './binary/a.bundle.js'))).toBeTruthy();
    });
});
