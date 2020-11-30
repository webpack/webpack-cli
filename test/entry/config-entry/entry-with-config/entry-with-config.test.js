'use strict';

const { run } = require('../../../utils/test-utils');

describe('default entry and config entry all exist', () => {
    it('should use config entry if config entry existed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', '../1.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toContain('./a.js');
    });
});
