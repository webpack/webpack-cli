'use strict';

const { run } = require('../../../utils/test-utils');

describe('config entry and command entry all exist', () => {
    it('should use command entry if config command existed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', '../1.js', './index.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toContain('./index.js');
    });
});
