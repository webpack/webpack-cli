'use strict';

const { run } = require('../utils/test-utils');

describe('--devtool flag', () => {
    it('should set devtool option', () => {
        const { stderr, stdout } = run(__dirname, ['--devtool', 'source-map']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`devtool: 'source-map'`);
    });

    it('should throw error for invalid config', () => {
        const { stderr } = run(__dirname, ['--devtool', 'invalid']);

        expect(stderr).toContain('ValidationError: Invalid configuration object');
    });
});
