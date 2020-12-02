'use strict';

const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('empty config', () => {
    it('should work', () => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', resolve(__dirname, 'webpack.config.js'), '--mode', 'development'],
            false,
        );

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });
});
