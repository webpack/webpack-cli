'use strict';

const { runAsync } = require('../../utils/test-utils');

describe('module config related flag', () => {
    it('should config records-path correctly', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--records-path', './bin/records.json']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('records.json');
    });

    it('should config records-input-path correctly', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--records-input-path', './bin/records.json']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('records.json');
    });

    it('should config records-output-path correctly', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--records-output-path', './bin/records.json']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('records.json');
    });
});
