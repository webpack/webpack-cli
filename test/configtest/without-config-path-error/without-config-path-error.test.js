'use strict';

const path = require('path');

const { run } = require('../../utils/test-utils');

describe("'configtest' command without the configuration path option", () => {
    it.only('should validate default configuration', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['configtest'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Invalid configuration object.');
        expect(stderr).toContain('configuration.mode should be one of these:');
        expect(stdout).toContain(`Validate '${path.resolve(__dirname, 'webpack.config.js')}'.`);
    });
});
