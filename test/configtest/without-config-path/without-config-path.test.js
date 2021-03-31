'use strict';

const path = require('path');

const { runAsync } = require('../../utils/test-utils');

describe("'configtest' command without the configuration path option", () => {
    it.only('should validate default configuration', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['configtest'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`Validate '${path.resolve(__dirname, 'webpack.config.js')}'.`);
        expect(stdout).toContain('There are no validation errors in the given webpack configuration.');
    });
});
