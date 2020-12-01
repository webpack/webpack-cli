'use strict';

const { run } = require('../../utils/test-utils');

describe('Node target', () => {
    it('should emit the correct code', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });
});
