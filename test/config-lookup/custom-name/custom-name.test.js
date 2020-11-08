'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('custom config file', () => {
    it('should work', () => {
        const { exitCode } = run(__dirname, ['--config', resolve(__dirname, 'config.webpack.js')], false);

        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, './binary/a.bundle.js'))).toBeTruthy();
    });
});
