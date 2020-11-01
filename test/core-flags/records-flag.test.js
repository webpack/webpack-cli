'use strict';

const { run } = require('../utils/test-utils');

describe('module config related flag', () => {
    it('should config records-path correctly', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--records-path', './bin/records.json']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('records.json');
    });

    it('should config records-input-path correctly', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--records-input-path', './bin/records.json']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('records.json');
    });

    it('should config records-output-path correctly', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--records-output-path', './bin/records.json']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('records.json');
    });
});
